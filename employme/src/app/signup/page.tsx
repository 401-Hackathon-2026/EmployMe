"use client"

import { useState } from "react"
import { signup } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [retypePassword, setRetypePassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreateUser = async () => {
    if (!email || !password || !retypePassword) {
      alert("All fields are required")
      return
    }
    if (password !== retypePassword) {
      alert("Passwords do not match")
      return
    }

    setLoading(true)

    const result = await signup(email, password)

    setLoading(false)

    if (result?.error) {
      alert(result.error)
    } else if (result?.success) {
      alert(result.success)
      router.push("/")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-4xl font-bold">Create Account</h1>

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

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Retype Password</label>
            <input
              type="password"
              placeholder="Retype password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              disabled={loading}
            />
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={handleCreateUser}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
        </Button>

        <div className="text-sm">
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