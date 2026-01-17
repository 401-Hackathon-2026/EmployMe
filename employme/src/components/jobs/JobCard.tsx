"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Job } from "@/types/job"

export default function JobCard({ job }: { job: Job }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: job.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-md border bg-card p-3 text-sm shadow-sm cursor-grab active:cursor-grabbing"
    >
      <p className="font-medium">{job.company}</p>
      <p className="text-muted-foreground">{job.position}</p>
    </div>
  )
}
