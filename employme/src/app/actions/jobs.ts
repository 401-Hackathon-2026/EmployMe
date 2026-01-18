"use server"

import { supabase } from "@/lib/supabase"
import { Job } from "@/types/job"
import { revalidatePath } from "next/cache"
import { JobStatus, JobPriority } from "@/types/job"

/**
 * Fetch all jobs
 */
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

/**
 * Create a new job
 */
export async function createJob(job: Partial<Job>) {
  const { error } = await supabase.from("jobs").insert(job)

  if (error) {
    console.error(error)
    throw new Error("Failed to create job")
  }

  revalidatePath("/jobs")
}

/**
 * Update job status (used by drag & drop)
 */
export async function updateJobStatus(jobId: string, status: string) {
  const { error } = await supabase
    .from("jobs")
    .update({ status })
    .eq("id", jobId)

  if (error) {
    console.error(error)
    throw new Error("Failed to update job status")
  }

  revalidatePath("/jobs")
}


export async function updateJob(
  id: string,
  updates: {
    company: string
    position: string
    status: JobStatus
    priority: JobPriority
  }
) {
  const { error } = await supabase
    .from("jobs")
    .update(updates)
    .eq("id", id)

  if (error) {
    console.error(error)
    throw new Error("Failed to update job")
  }

  revalidatePath(`/jobs/${id}`)
  revalidatePath("/jobs")
}


export async function deleteJob(id: string) {
  // Delete join table first (safe even if no row exists)
  await supabase.from("user_jobs").delete().eq("job_id", id)

  // Delete job
  const { error } = await supabase.from("jobs").delete().eq("id", id)

  if (error) {
    console.error(error)
    throw new Error("Failed to delete job")
  }

  revalidatePath("/jobs")
}
