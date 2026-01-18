"use server"

import { createClient } from "@/lib/supabase/server"
import { Job } from "@/types/job"
import { revalidatePath } from "next/cache"
import { JobStatus, JobPriority } from "@/types/job"

/**
 * Fetch jobs for the authenticated user
 */
export async function getJobs(): Promise<Job[]> {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error("No authenticated user:", userError)
      return []
    }

    const { data, error } = await supabase
      .from("user_jobs")
      .select(`
        job_id,
        jobs (*)
      `)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error fetching jobs:", error)
      return []
    }

    const jobs = data?.map((item: any) => item.jobs).filter(Boolean) || []
    return jobs as Job[]
  } catch (err) {
    console.error("Unexpected error:", err)
    return []
  }
}

/**
 * Create a new job and link it to the authenticated user
 */
export async function createJob(job: Partial<Job>) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error("No authenticated user:", userError)
    throw new Error("You must be logged in to create a job")
  }

  const { data: newJob, error: jobError } = await supabase
    .from("jobs")
    .insert(job)
    .select()
    .single()

  if (jobError) {
    console.error("Failed to create job:", jobError)
    throw new Error("Failed to create job")
  }

  const { error: linkError } = await supabase
    .from("user_jobs")
    .insert({
      user_id: user.id,
      job_id: newJob.id,
    })

  if (linkError) {
    console.error("Failed to link job to user:", linkError)
    throw new Error("Failed to link job to user")
  }

  revalidatePath("/jobs")
  revalidatePath("/calendar")
}

/**
 * Update job status (used by drag & drop)
 */
export async function updateJobStatus(jobId: string, status: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error("You must be logged in to update a job")
  }

  // Verify job belongs to user
  const { data: userJob } = await supabase
    .from("user_jobs")
    .select("job_id")
    .eq("user_id", user.id)
    .eq("job_id", jobId)
    .single()

  if (!userJob) {
    throw new Error("Job not found or access denied")
  }

  const { error } = await supabase
    .from("jobs")
    .update({ status })
    .eq("id", jobId)

  if (error) {
    console.error(error)
    throw new Error("Failed to update job status")
  }

  revalidatePath("/jobs")
  revalidatePath("/calendar")
}

/**
 * Update job details
 */
export async function updateJob(
  id: string,
  updates: {
    company: string
    position: string
    status: JobStatus
    priority: JobPriority
    date_applied?: string | null
    date_of_interview?: string | null
  }
) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error("You must be logged in to update a job")
  }

  // Verify job belongs to user
  const { data: userJob } = await supabase
    .from("user_jobs")
    .select("job_id")
    .eq("user_id", user.id)
    .eq("job_id", id)
    .single()

  if (!userJob) {
    throw new Error("Job not found or access denied")
  }

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
  revalidatePath("/calendar")
}

/**
 * Delete a job
 */
export async function deleteJob(id: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    throw new Error("You must be logged in to delete a job")
  }

  // Verify job belongs to user
  const { data: userJob } = await supabase
    .from("user_jobs")
    .select("job_id")
    .eq("user_id", user.id)
    .eq("job_id", id)
    .single()

  if (!userJob) {
    throw new Error("Job not found or access denied")
  }

  // Delete join table entry first
  await supabase.from("user_jobs").delete().eq("job_id", id)

  // Delete job
  const { error } = await supabase.from("jobs").delete().eq("id", id)

  if (error) {
    console.error(error)
    throw new Error("Failed to delete job")
  }

  revalidatePath("/jobs")
  revalidatePath("/calendar")
}