import AppShell from "@/components/layout/AppShell"
import { getJobs } from "@/app/actions/jobs"
import NotificationsCard from "@/components/dashboard/NotificationsCard"
import ApplicationFlowCard from "@/components/dashboard/ApplicationFlowCard"

export default async function DashboardPage() {
  const jobs = await getJobs()

  return (
    <AppShell>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          <NotificationsCard jobs={jobs} />
        </aside>

        {/* Main content */}
        <main>
          <ApplicationFlowCard jobs={jobs} />
        </main>
      </div>
    </AppShell>
  )
}
