import { Job } from "@/types/job"

export default function NotificationsCard({ jobs }: { jobs: Job[] }) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-semibold">Notifications</h2>
      <p className="text-sm text-muted-foreground">
        Upcoming follow-ups
      </p>

      <div className="mt-3 text-sm">
        <span className="font-medium">{jobs.length}</span>{" "}
        total applications
      </div>
    </div>
  )
}