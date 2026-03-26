"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

interface WaitlistModalProps {
  onClose: () => void;
}

export default function WaitlistModal({ onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase
        .from("waitlist")
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          setSubmitted(true);
        } else {
          setError("Something went wrong. Try again.");
        }
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white text-xl"
        >
          &times;
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">&#10003;</div>
            <h2 className="text-xl font-bold text-white mb-2">
              You&apos;re on the list!
            </h2>
            <p className="text-zinc-400 text-sm">
              We&apos;ll notify you when Pro launches.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-1">
              Get early access to Pro
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Be the first to unlock unlimited analyses, AI rewrites, and more.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-40"
              >
                {loading ? "Joining..." : "Join waitlist"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
