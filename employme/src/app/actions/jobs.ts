"use server"

import { supabase } from "@/lib/supabase"
import { Job } from "@/types/job"

export async function getJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
    throw new Error("Failed to fetch jobs")
  }

  return data as Job[]
}
