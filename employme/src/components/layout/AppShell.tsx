import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
            <Link href="/dashboard" className="text-lg font-semibold">
                EmployMe
            </Link>
          <Button>Add Job</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-6">
        {children}
      </main>
    </div>
  )
}
