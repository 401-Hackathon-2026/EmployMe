import AppShell from "@/components/layout/AppShell"
import { getJobs } from "@/app/actions/jobs"

export default async function DashboardPage() {
  const jobs = await getJobs()

  return (
    <AppShell>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left */}
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            Upcoming follow-ups
          </p>

          {/* Temporary debug */}
          <p className="mt-2 text-xs text-muted-foreground">
            Total jobs: {jobs.length}
          </p>
        </div>

        {/* Center */}
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Application Flow</h2>
          <p className="text-sm text-muted-foreground">
            Sankey diagram placeholder
          </p>

          {/* Temporary debug */}
          <pre className="mt-4 text-xs">
            {JSON.stringify(jobs.map(j => j.status), null, 2)}
          </pre>
        </div>

        {/* Right */}
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Momentum</h2>
          <p className="text-sm text-muted-foreground">
            Weekly activity
          </p>
        </div>
      </div>
    </AppShell>
  )
}
