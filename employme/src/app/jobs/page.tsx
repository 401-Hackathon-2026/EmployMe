import { getJobs } from "@/app/actions/jobs"
import JobsClientWrapper from "./JobsClientWrapper"

export default async function JobsPage() {
  const jobs = await getJobs()
  return <JobsClientWrapper jobs={jobs} />
}