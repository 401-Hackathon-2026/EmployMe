import AppShell from "@/components/layout/AppShell"
import { Button } from "@/components/ui/button"
import KanbanColumn from "@/components/jobs/KanbanColumn"
import JobCard from "@/components/jobs/JobCard"

export default function JobsPage() {
  return (
    <AppShell>
      {/* Header */}
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

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <KanbanColumn title="Wishlist" />
        <KanbanColumn title="Applied">
          <JobCard />
        </KanbanColumn>
        <KanbanColumn title="Interview" />
        <KanbanColumn title="Offer" />
        <KanbanColumn title="Rejected" />
      </div>
    </AppShell>
  )
}
