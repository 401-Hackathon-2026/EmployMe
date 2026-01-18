"use client"

import { useRouter } from "next/navigation"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Job } from "@/types/job"

export default function JobCard({ job }: { job: Job }) {
  const router = useRouter()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job.id,
    data: { type: "job" },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-md border bg-card p-3 text-sm shadow-sm"
      onClick={() => {
        // Prevent navigation if a drag is in progress
        if (isDragging) return
        router.push(`/jobs/${job.id}`)
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{job.company}</p>
          <p className="text-muted-foreground truncate">{job.position}</p>
          
          {/* Date information - only show if dates exist */}
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            {job.date_applied && (
              <p>📅 Applied: {formatDate(job.date_applied)}</p>
            )}
            {job.date_of_interview && (
              <p>🗓️ Interview: {formatDate(job.date_of_interview)}</p>
            )}
          </div>
        </div>

        {/* Drag handle ONLY */}
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 cursor-grab active:cursor-grabbing select-none rounded border px-2 py-1 text-xs text-muted-foreground"
          title="Drag"
        >
          Drag
        </div>
      </div>
    </div>
  )
}