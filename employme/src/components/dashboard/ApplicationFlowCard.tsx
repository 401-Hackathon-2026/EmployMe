import { Job } from "@/types/job"

type StatusCounts = Record<string, number>

function getStatusCounts(jobs: Job[]): StatusCounts {
  return jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1
    return acc
  }, {} as StatusCounts)
}

export default function ApplicationFlowCard({ jobs }: { jobs: Job[] }) {
  const statusCounts = getStatusCounts(jobs)

  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-semibold">Application Flow</h2>
      <p className="text-sm text-muted-foreground">
        Application stage distribution
      </p>

      {/* Phase 1: debug visualization */}
      <div className="mt-4 space-y-1 text-sm">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="flex justify-between">
            <span className="capitalize">{status}</span>
            <span className="font-medium">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}