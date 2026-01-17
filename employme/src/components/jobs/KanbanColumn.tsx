"use client"

import { useDroppable } from "@dnd-kit/core"
import { ReactNode } from "react"

export default function KanbanColumn({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children?: ReactNode
}) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col rounded-lg border bg-background"
    >
      <div className="border-b px-3 py-2 font-medium">
        {title}
      </div>

      <div className="flex-1 space-y-2 p-3">
        {children ?? (
          <p className="text-sm text-muted-foreground">
            No jobs
          </p>
        )}
      </div>
    </div>
  )
}
