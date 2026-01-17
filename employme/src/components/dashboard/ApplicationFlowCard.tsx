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

  const links = []

  // Applied → Interview
  if (counts.interview) {
    links.push({
      source: "Applied",
      target: "Interview",
      value: counts.interview,
    })
  }

  // Applied → Offer
  if (counts.offer) {
    links.push({
      source: "Applied",
      target: "Offer",
      value: counts.offer,
    })
  }

  // Applied → Rejected
  if (counts.rejected) {
    links.push({
      source: "Applied",
      target: "Rejected",
      value: counts.rejected,
    })
  }

  return { nodes, links }
}

export default function ApplicationFlowCard({ jobs }: { jobs: Job[] }) {
  const sankeyData = buildSankeyData(jobs)

  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-semibold">Application Flow</h2>
      <p className="text-sm text-muted-foreground">Visual flow of applications</p>

      <div className="mt-4">
        <SankeyChart data={sankeyData} />
      </div>
    </div>
  )
}
