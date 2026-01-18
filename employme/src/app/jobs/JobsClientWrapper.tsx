"use client"

import dynamic from "next/dynamic"
import { Job } from "@/types/job"

const JobsClient = dynamic(() => import("./JobsClient"), {
  ssr: false,
})

export default function JobsClientWrapper({ 
  jobs, 
  onJobAdded 
}: { 
  jobs: Job[]
  onJobAdded: () => void
}) {
  return <JobsClient jobs={jobs} onJobAdded={onJobAdded} />
}