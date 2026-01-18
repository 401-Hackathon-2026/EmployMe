"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { getJobs, updateJobStatus } from "@/app/actions/jobs"
import { Job } from "@/types/job"
import AppShell from "@/components/layout/AppShell"
import KanbanColumn from "@/components/jobs/KanbanColumn"
import JobCard from "@/components/jobs/JobCard"
import AddJobDialog from "@/components/jobs/AddJobDialog"

import {
  DndContext,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useRouter } from "next/navigation"

function groupJobsByStatus(jobs: Job[]) {
  return {
    applied: jobs.filter(j => j.status === "applied"),
    interview: jobs.filter(j => j.status === "interview"),
    offer: jobs.filter(j => j.status === "offer"),
    rejected: jobs.filter(j => j.status === "rejected"),
  }
}

export default function JobsClient() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  // Load jobs when component mounts
  useEffect(() => {
    async function loadJobs() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const userJobs = await getJobs(user.id)
        setJobs(userJobs)
      }
      
      setLoading(false)
    }
    
    loadJobs()
  }, [])

  const grouped = groupJobsByStatus(jobs)

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return

    const jobId = active.id as string
    const newStatus = over.id as string

    await updateJobStatus(jobId, newStatus)
    
    // Reload jobs after updating
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const userJobs = await getJobs(user.id)
      setJobs(userJobs)
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Job Board</h1>
          <p className="text-muted-foreground">
            Manage your applications
          </p>
        </div>

        <AddJobDialog />
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {Object.entries(grouped).map(([status, jobs]) => (
            <KanbanColumn
              key={status}
              id={status}
              title={status.charAt(0).toUpperCase() + status.slice(1)}
            >
              <SortableContext
                items={jobs.map(j => j.id)}
                strategy={verticalListSortingStrategy}
              >
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </SortableContext>
            </KanbanColumn>
          ))}
        </div>
      </DndContext>
    </AppShell>
  )
}