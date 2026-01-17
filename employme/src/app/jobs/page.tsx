import AppShell from "@/components/layout/AppShell"
import { Button } from "@/components/ui/button"

export default function JobsPage() {
  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Job Board</h1>
          <p className="text-muted-foreground">
            Manage your applications
          </p>
        </div>

        <Button>
          + Add Job
        </Button>
      </div>

      {/* Kanban board will go here */}
      <div className="mt-8 text-muted-foreground">
        Kanban board
      </div>
    </AppShell>
  )
}
