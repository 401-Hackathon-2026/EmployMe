import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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
  const supabase = await createClient()
  
  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const start = searchParams.get("start")
  const end = searchParams.get("end")

  // Get jobs for this user through user_jobs
  let query = supabase
    .from("user_jobs")
    .select(`
      job_id,
      jobs (
        id,
        company,
        position,
        date_applied,
        date_interviewed,
        date_accepted,
        date_rejected
      )
    `)
    .eq("user_id", user.id)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Extract jobs from nested structure
  const jobs = (data?.map((item: any) => item.jobs).filter(Boolean) || []) as JobRow[]

  // Filter jobs by date range if provided
  let filteredJobs = jobs
  if (start && end) {
    filteredJobs = jobs.filter(job => {
      const dates = [
        job.date_applied,
        job.date_interviewed,
        job.date_accepted,
        job.date_rejected,
      ].filter(Boolean)
      
      return dates.some(date => date! >= start && date! < end)
    })
  }

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

  for (const j of filteredJobs) {
    if (j.date_applied) push(j, "applied", j.date_applied)
    if (j.date_interviewed) push(j, "interviewed", j.date_interviewed)
    if (j.date_accepted) push(j, "accepted", j.date_accepted)
    if (j.date_rejected) push(j, "rejected", j.date_rejected)
  }

  return NextResponse.json(events)
}