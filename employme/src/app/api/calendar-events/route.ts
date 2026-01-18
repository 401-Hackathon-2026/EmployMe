import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

type JobRow = {
  id: string
  company: string
  position: string
  date_applied: string | null
  date_of_interview: string | null
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
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error("Calendar API - User auth error:", userError)
      return NextResponse.json({ error: "Unauthorized - " + userError.message }, { status: 401 })
    }
    
    if (!user) {
      console.error("Calendar API - No user found")
      return NextResponse.json({ error: "Unauthorized - No user" }, { status: 401 })
    }

    console.log("Calendar API - User ID:", user.id)

    const { searchParams } = new URL(req.url)
    const start = searchParams.get("start")
    const end = searchParams.get("end")

    console.log("Calendar API - Date range:", { start, end })

    // Get jobs for this user through user_jobs
    const { data, error } = await supabase
      .from("user_jobs")
      .select(`
        job_id,
        jobs (
          id,
          company,
          position,
          date_applied,
          date_of_interview,
          date_accepted,
          date_rejected
        )
      `)
      .eq("user_id", user.id)

    if (error) {
      console.error("Calendar API - Database error:", error)
      return NextResponse.json({ 
        error: "Database error: " + error.message,
        details: error
      }, { status: 500 })
    }

    console.log("Calendar API - Raw data:", data)

    // Extract jobs from nested structure
    const jobs = (data?.map((item: any) => item.jobs).filter(Boolean) || []) as JobRow[]
    
    console.log("Calendar API - Extracted jobs count:", jobs.length)

    // Filter jobs by date range if provided
    let filteredJobs = jobs
    if (start && end) {
      filteredJobs = jobs.filter(job => {
        const dates = [
          job.date_applied,
          job.date_of_interview,
          job.date_accepted,
          job.date_rejected,
        ].filter(Boolean)
        
        return dates.some(date => date! >= start && date! < end)
      })
      console.log("Calendar API - Filtered jobs count:", filteredJobs.length)
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
      if (j.date_of_interview) push(j, "interviewed", j.date_of_interview)
      if (j.date_accepted) push(j, "accepted", j.date_accepted)
      if (j.date_rejected) push(j, "rejected", j.date_rejected)
    }

    console.log("Calendar API - Events count:", events.length)

    return NextResponse.json(events)
  } catch (err) {
    console.error("Calendar API - Unexpected error:", err)
    return NextResponse.json({ 
      error: "Unexpected error",
      message: err instanceof Error ? err.message : String(err)
    }, { status: 500 })
  }
}