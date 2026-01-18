import AppShell from "@/components/layout/AppShell"
import JobDetailClient from "./JobDetailClient"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const {id} = await params
  const supabase = await createClient()
  
  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    notFound()
  }

  // Verify job belongs to user and fetch it
  const { data, error } = await supabase
    .from("user_jobs")
    .select(`
      job_id,
      jobs (*)
    `)
    .eq("user_id", user.id)
    .eq("job_id", id)
    .single()

  if (error || !data?.jobs) {
    notFound()
  }

  return (
    <AppShell>
      <JobDetailClient initialJob={data.jobs as any} />
    </AppShell>
  )
}