import JobsClient from "./JobsClient"

export default async function JobsPage() {
  // Remove the getJobs call from here - let the client handle it
  return <JobsClient />
}