import AppShell from "@/components/layout/AppShell"
import KanbanColumn from "@/components/jobs/KanbanColumn"
import JobCard from "@/components/jobs/JobCard"
import AddJobDialog from "@/components/jobs/AddJobDialog"
import { getJobs } from "@/app/actions/jobs"
import { Job } from "@/types/job"

function groupJobsByStatus(jobs: Job[]) {
  return {
    wishlist: jobs.filter(j => j.status === "wishlist"),
    applied: jobs.filter(j => j.status === "applied"),
    interview: jobs.filter(j => j.status === "interview"),
    offer: jobs.filter(j => j.status === "offer"),
    rejected: jobs.filter(j => j.status === "rejected"),
  }
}

export default async function JobsPage() {
  const jobs = await getJobs()
  const grouped = groupJobsByStatus(jobs)

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

        <AddJobDialog />
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <KanbanColumn title="Applied">
          {grouped.applied.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </KanbanColumn>

        <KanbanColumn title="Interview">
          {grouped.interview.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </KanbanColumn>

        <KanbanColumn title="Offer">
          {grouped.offer.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </KanbanColumn>

        <KanbanColumn title="Rejected">
          {grouped.rejected.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </KanbanColumn>
      </div>
    </AppShell>
  )
}
