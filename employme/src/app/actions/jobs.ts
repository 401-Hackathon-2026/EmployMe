"use server"

import { createClient } from "@/lib/supabase/server"
import { Job } from "@/types/job"

/**
 * Fetch jobs for the authenticated user
 */
export async function getJobs(): Promise<Job[]> {
  try {
    const supabase = await createClient()
    
    // Get the authenticated user from the session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error("No authenticated user:", userError)
      return []
    }

    // Query through user_jobs to get only this user's jobs
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

    // Extract the jobs from the nested structure
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
  
  // Get the authenticated user from the session
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error("No authenticated user:", userError)
    throw new Error("You must be logged in to create a job")
  }

  console.log("Creating job for user:", user.id)

  // Step 1: Create the job in the jobs table
  const { data: newJob, error: jobError } = await supabase
    .from("jobs")
    .insert(job)
    .select()
    .single()

  if (jobError) {
    console.error("Failed to create job:", jobError)
    throw new Error("Failed to create job")
  }

  console.log("Created job with ID:", newJob.id)

  // Step 2: Link the job to the user in user_jobs table
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

  console.log("Successfully linked job to user!")
}

/**
 * Update job status for the authenticated user's job
 */
export async function updateJobStatus(
  jobId: string,
  status: string
) {
  const supabase = await createClient()
  
  // Get the authenticated user from the session
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error("No authenticated user:", userError)
    throw new Error("You must be logged in to update a job")
  }

  // Verify the job belongs to this user before updating
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
}