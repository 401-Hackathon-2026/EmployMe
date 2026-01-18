import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

type JobRow = {
  id: string
  company: string
  position: string
  date_applied: string | null
  date_interviewed: string | null
  date_accepted: string | null
  date_rejected: string | null
}

type Kind = "applied" | "interviewed" | "accepted" | "rejected"

const LABEL: Record<Kind, string> = {
  applied: "Applied",
  interviewed: "Interviewed",
  accepted: "Accepted",
  rejected: "Rejected",
}

const COLOR: Record<Kind, string> = {
  applied: "#1f76b4",
  interviewed: "#ff802c",
  accepted: "#2ca02c",
  rejected: "#d62728",
}


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const start = searchParams.get("start") // 'YYYY-MM-DD'
  const end = searchParams.get("end")     // 'YYYY-MM-DD'

  let q = supabase
    .from("jobs")
    .select("id,company,position,date_applied,date_interviewed,date_accepted,date_rejected")

  // only fetch jobs that have ANY date within the visible range
  if (start && end) {
    q = q.or(
      [
        `date_applied.gte.${start},date_applied.lt.${end}`,
        `date_interviewed.gte.${start},date_interviewed.lt.${end}`,
        `date_accepted.gte.${start},date_accepted.lt.${end}`,
        `date_rejected.gte.${start},date_rejected.lt.${end}`,
      ].join(",")
    )
  }

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const jobs = (data ?? []) as JobRow[]

  const events: any[] = []
  const push = (j: JobRow, kind: Kind, date: string) => {
  const color = COLOR[kind]

  events.push({
    id: `job:${j.id}:${kind}:${date}`,
    title: `${j.company} — ${j.position} (${LABEL[kind]})`,
    start: date,
    allDay: true,

    backgroundColor: color,
    borderColor: color,
    textColor: "#ffffff",

    extendedProps: { jobId: j.id, kind },
  })
}


  for (const j of jobs) {
    if (j.date_applied) push(j, "applied", j.date_applied)
    if (j.date_interviewed) push(j, "interviewed", j.date_interviewed)
    if (j.date_accepted) push(j, "accepted", j.date_accepted)
    if (j.date_rejected) push(j, "rejected", j.date_rejected)
  }

  return NextResponse.json(events)
}
