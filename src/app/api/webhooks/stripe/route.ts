import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;
        const userId = session.metadata?.supabase_user_id;

        if (!userId) {
          // Fallback: find user by customer email
          const customer = await getStripe().customers.retrieve(customerId) as Stripe.Customer;
          const { data: users } = await supabaseAdmin.auth.admin.listUsers();
          const matchedUser = users?.users?.find(u => u.email === customer.email);
          if (matchedUser) {
            await upsertSubscription(matchedUser.id, subscriptionId, customerId, "active");
          }
        } else {
          await upsertSubscription(userId, subscriptionId, customerId, "active");
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;
        const customerId = subscription.customer as string;

        if (userId) {
          await upsertSubscription(
            userId,
            subscription.id,
            customerId,
            subscription.status === "active" ? "active" : subscription.status
          );
        } else {
          // Fallback: find by stripe_customer_id
          const { data: existingSub } = await supabaseAdmin
            .from("subscriptions")
            .select("user_id")
            .eq("stripe_customer_id", customerId)
            .single();

          if (existingSub) {
            await upsertSubscription(
              existingSub.user_id,
              subscription.id,
              customerId,
              subscription.status === "active" ? "active" : subscription.status
            );
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function upsertSubscription(
  userId: string,
  stripeSubscriptionId: string,
  stripeCustomerId: string,
  status: string
) {
  const { data: existing } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existing) {
    await supabaseAdmin
      .from("subscriptions")
      .update({
        stripe_subscription_id: stripeSubscriptionId,
        stripe_customer_id: stripeCustomerId,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);
  } else {
    await supabaseAdmin
      .from("subscriptions")
      .insert({
        user_id: userId,
        stripe_subscription_id: stripeSubscriptionId,
        stripe_customer_id: stripeCustomerId,
        status,
      });
  }
}
