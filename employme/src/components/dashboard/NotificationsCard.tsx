import { Job } from "@/types/job"

type Notification = {
  id: string
  text: string
  icon: string
}

function getMockNotifications(jobs: Job[]): Notification[] {
  const notifications: Notification[] = []

  jobs.forEach((job) => {
    if (job.status === "applied") {
      notifications.push({
        id: job.id,
        icon: "⏰",
        text: `Follow up with ${job.company} – no response yet`,
      })
    }

    if (job.status === "interview") {
      notifications.push({
        id: `${job.id}-interview`,
        icon: "📅",
        text: `Prepare for interview at ${job.company}`,
      })
    }
  })

  return notifications.slice(0, 3)
}

export default function NotificationsCard({ jobs }: { jobs: Job[] }) {
  const notifications = getMockNotifications(jobs)

  return (
    <section className="rounded-xl border bg-background p-4">
      <h3 className="font-semibold">Notifications</h3>
      <p className="mb-3 text-sm text-muted-foreground">
        Upcoming follow-ups
      </p>

      {notifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You’re all caught up 🎉
        </p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="flex items-start gap-2 rounded-md bg-muted px-3 py-2 text-sm transition-colors hover:bg-muted/70"
            >
              <span className="text-base leading-none">{n.icon}</span>
              <span className="leading-snug">{n.text}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
