"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { logout } from "@/app/actions/auth"
import { usePathname } from "next/navigation"

export default function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-lg font-semibold">
              EmployMe
            </Link>
            
            <nav className="flex gap-4">
              <Link 
                href="/dashboard"
                className={`text-sm transition-colors hover:text-foreground ${
                  pathname === '/dashboard' 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/jobs"
                className={`text-sm transition-colors hover:text-foreground ${
                  pathname === '/jobs' 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground'
                }`}
              >
                Jobs
              </Link>
            </nav>
          </div>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-6">
        {children}
      </main>
    </div>
  )
}