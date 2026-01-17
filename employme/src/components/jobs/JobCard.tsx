import { Job } from "@/types/job"

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="rounded-md border bg-card p-3 text-sm shadow-sm hover:shadow transition">
      <p className="font-medium">{job.company}</p>
      <p className="text-muted-foreground">{job.position}</p>
    </div>
  )
}
