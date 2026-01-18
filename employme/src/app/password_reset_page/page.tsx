"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Optional: verify if the user arrived via a recovery link
    const type = searchParams.get("type");
    if (type !== "recovery") {
      setMessage("Invalid or expired link.");
    }
  }, [searchParams]);

  const handleResetPassword = async () => {
    if (!password) return alert("Enter a new password");

    setLoading(true);

    const { data, error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/"), 3000);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-4xl font-bold">Set New Password</h1>

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <Button className="w-full" onClick={handleResetPassword} disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>

        {message && <p className="text-sm mt-2 text-center text-green-600">{message}</p>}
      </div>
    </main>
  );
}
