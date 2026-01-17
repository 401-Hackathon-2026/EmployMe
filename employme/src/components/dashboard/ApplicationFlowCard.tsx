import { Job } from "@/types/job"
import SankeyChart from "./SankeyChart"

type SankeyNode = { id: string }
type SankeyLink = {
  source: string
  target: string
  value: number
}

function buildSankeyData(jobs: Job[]) {
  const nodes: SankeyNode[] = [
    { id: "Applied" },
    { id: "Interview" },
    { id: "Accepted" },
    { id: "Rejected" },
  ]

  const counts = jobs.reduce<Record<string, number>>((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1
    return acc
  }, {})

  const links: SankeyLink[] = []

  if (counts.applied) {
    links.push({
      source: "Applied",
      target: "Interview",
      value: counts.applied,
    })
  }

  if (counts.interview) {
    links.push({
      source: "Interview",
      target: "Accepted",
      value: counts.interview,
    })
  }

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
      <p className="text-sm text-muted-foreground">
        Visual flow of applications
      </p>

      <div className="mt-4">
        <SankeyChart data={sankeyData} />
      </div>
    </div>
  )
}
