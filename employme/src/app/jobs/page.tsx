"use client"

import { useEffect, useState } from "react"
import { getJobs } from "@/app/actions/jobs"
import JobsClientWrapper from "./JobsClientWrapper"
import { supabase } from "@/lib/supabase/client"
import { Job } from "@/types/job"

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadJobs() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const userJobs = await getJobs(user.id)
        setJobs(userJobs)
      }
      setLoading(false)
    }
    loadJobs()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return <JobsClientWrapper jobs={jobs} />
}