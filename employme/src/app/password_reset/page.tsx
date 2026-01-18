"use client"

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: "http://localhost:3000/password_reset_page"});

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your email for a password reset link!");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-4xl font-bold">Reset Password</h1>

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <Button className="w-full" onClick={handleResetPassword}>
          Send Reset Link
        </Button>

        {message && (
          <p className="text-sm mt-2 text-center text-green-600">{message}</p>
        )}

        <div className="text-sm mt-4">
          <button
            className="underline"
            onClick={() => router.push("/")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </main>
  );
}
