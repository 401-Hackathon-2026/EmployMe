import AppShell from "@/components/layout/AppShell"
import JobCalendar from "./JobCalendar"

export default function CalendarPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">Job milestones by date</p>
      </div>
      <JobCalendar />
    </AppShell>
  )
}