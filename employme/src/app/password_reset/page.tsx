"use client"

import { useState } from "react"
import { resetPassword } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleResetPassword = async () => {
    if (!email) {
      alert("Please enter your email")
      return
    }

    setLoading(true)
    const result = await resetPassword(email)
    setLoading(false)

    if (result?.error) {
      setMessage(result.error)
    } else if (result?.success) {
      setMessage(result.success)
    }
  }

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
              disabled={loading}
            />
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>

        {message && (
          <p className="text-sm mt-2 text-center text-green-600">{message}</p>
        )}

        <div className="text-sm mt-4">
          <button
            className="underline"
            onClick={() => router.push("/")}
            disabled={loading}
          >
            Back to Login
          </button>
        </div>
      </div>
    </main>
  )
}