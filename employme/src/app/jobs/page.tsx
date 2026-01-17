import { getJobs } from "@/app/actions/jobs"
import JobsClient from "./JobsClient"

export default async function JobsPage() {
  const jobs = await getJobs()
  return <JobsClient jobs={jobs} />
}
