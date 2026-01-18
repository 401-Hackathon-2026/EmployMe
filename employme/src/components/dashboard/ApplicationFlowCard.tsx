import { Job } from "@/types/job"
import SankeyChart from "./SankeyChart"

type SankeyNode = { id: string }
type SankeyLink = { source: string; target: string; value: number }

function buildSankeyData(jobs: Job[]) {
  const nodes = [
    { id: "Applied" },
    { id: "Interview" },
    { id: "Offer" },
    { id: "Rejected" },
  ]

  const counts = jobs.reduce<Record<string, number>>((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1
    return acc
  }, {})

  const links: SankeyLink[] = []

  if (counts.interview)
    links.push({ source: "Applied", target: "Interview", value: counts.interview })

  if (counts.offer)
    links.push({ source: "Applied", target: "Offer", value: counts.offer })

  if (counts.rejected)
    links.push({ source: "Applied", target: "Rejected", value: counts.rejected })

  return { nodes, links }
}

export default function ApplicationFlowCard({ jobs }: { jobs: Job[] }) {
  const sankeyData = buildSankeyData(jobs)

  return (
    <section className="rounded-xl border bg-background p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Application Flow</h2>
        <p className="text-sm text-muted-foreground">
          Visual flow of your applications
        </p>
      </div>

      <SankeyChart data={sankeyData} />
    </section>
  )
}
