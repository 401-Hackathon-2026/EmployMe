"use client"

import { useState, useEffect } from "react"
import { getJobs, updateJobStatus } from "@/app/actions/jobs"
import { Job } from "@/types/job"
import AppShell from "@/components/layout/AppShell"
import KanbanColumn from "@/components/jobs/KanbanColumn"
import JobCard from "@/components/jobs/JobCard"
import AddJobDialog from "@/components/jobs/AddJobDialog"

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useRouter } from "next/navigation"

const STATUSES = ["applied", "interview", "offer", "rejected"] as const
type Status = (typeof STATUSES)[number]

function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value)
}

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
      const userJobs = await getJobs()
      setJobs(userJobs)
      setLoading(false)
    }
    
    loadJobs()
  }, [])

  const grouped = groupJobsByStatus(jobs)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // prevents click->drag accidental fires
    })
  )

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    if (active.id === over.id) return

    const jobId = active.id as string

    // If you're hovering over a sortable item, over.id will be the job id.
    // Use containerId to find the column status.
    const containerId =
      (over.data.current as any)?.sortable?.containerId as string | undefined

    const candidateStatus = containerId ?? (over.id as string)

    if (!isStatus(candidateStatus)) {
      // If this happens, it means a drop target wasn't a column.
      // We ignore instead of corrupting status.
      return
    }

    await updateJobStatus(jobId, candidateStatus)
    
    // Reload jobs after updating
    const userJobs = await getJobs()
    setJobs(userJobs)
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Job Board</h1>
          <p className="text-muted-foreground">Manage your applications</p>
        </div>
        <AddJobDialog />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {Object.entries(grouped).map(([status, jobs]) => (
            <KanbanColumn
              key={status}
              id={status}
              title={status.charAt(0).toUpperCase() + status.slice(1)}
            >
              <SortableContext
                id={status} // ✅ THIS is what powers containerId
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