"use client"

import dynamic from "next/dynamic"
import { Job } from "@/types/job"

const JobsClient = dynamic(() => import("./JobsClient"), {
  ssr: false,
})

export default function JobsClientWrapper({ jobs }: { jobs: Job[] }) {
  return <JobsClient jobs={jobs} />
}
