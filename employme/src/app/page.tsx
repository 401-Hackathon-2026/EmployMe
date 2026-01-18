"use client"

import { useState } from "react"
import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setErrorMessage("")
    
    const result = await login(email, password)
    
    if (result?.error) {
      setErrorMessage(result.error)
      setLoading(false)
    }
    // On success, the server action will redirect
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-4xl font-bold">EmployMe</h1>
        <p className="text-lg text-muted-foreground">Welcome!</p>
        
        <div className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            {errorMessage && (
              <p className="text-red-600 text-sm mb-1">{errorMessage}</p>
            )}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrorMessage("")
              }}
              className="w-full rounded-md border px-3 py-2"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2"
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            className="w-full" 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="flex justify-between text-sm">
            <button 
              className="underline" 
              onClick={() => window.location.href = "/signup"}
              disabled={loading}
            >
              Create Account
            </button>
            <button 
              className="underline" 
              onClick={() => window.location.href = "/password_reset"}
              disabled={loading}
            >
              Forgot Password
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}