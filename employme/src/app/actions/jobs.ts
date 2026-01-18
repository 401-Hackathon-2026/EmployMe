"use server"



import { supabase } from "@/lib/supabase/client"

import { Job } from "@/types/job"

import { revalidatePath } from "next/cache"

import { JobStatus, JobPriority } from "@/types/job"



/**

 * Fetch jobs for a specific user

 */

export async function getJobs(userId: string): Promise<Job[]> {

  try {

    // Query through user_jobs to get only this user's jobs

    const { data, error } = await supabase

      .from("user_jobs")

      .select(`

        job_id,

        jobs (*)

      `)

      .eq("user_id", userId)



    if (error) {

      console.error("Error fetching jobs:", error)

      return [] // Return empty array instead of throwing

    }



    // Extract the jobs from the nested structure

    const jobs = data?.map((item: any) => item.jobs).filter(Boolean) || []

    return jobs as Job[]

  } catch (err) {

    console.error("Unexpected error:", err)

    return [] // Return empty array on any error

  }

}



/**

 * Create a new job and link it to user

 */

export async function createJob(job: Partial<Job> & { userId: string }) {

  const { userId, ...jobData } = job



  console.log("Received user ID:", userId)



  // Step 1: Create the job in the jobs table

  const { data: newJob, error: jobError } = await supabase

    .from("jobs")

    .insert(jobData)

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

      user_id: userId,

      job_id: newJob.id,

    })



  if (linkError) {

    console.error("Failed to link job to user:", linkError)

    throw new Error("Failed to link job to user")

  }



  console.log("Successfully linked job to user!")

}



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