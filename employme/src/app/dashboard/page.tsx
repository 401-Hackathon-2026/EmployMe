import AppShell from "@/components/layout/AppShell"
import { getJobs } from "@/app/actions/jobs"
import NotificationsCard from "@/components/dashboard/NotificationsCard"
import ApplicationFlowCard from "@/components/dashboard/ApplicationFlowCard"
import MomentumCard from "@/components/dashboard/MomentumCard"

export default async function DashboardPage() {
  const jobs = await getJobs()

  return (
    <AppShell>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <NotificationsCard jobs={jobs} />
        <ApplicationFlowCard jobs={jobs} />
        <MomentumCard />
      </div>
    </AppShell>
  )
}
