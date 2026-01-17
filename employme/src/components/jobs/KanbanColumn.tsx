import { ReactNode } from "react"

export default function KanbanColumn({
  title,
  children,
}: {
  title: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col rounded-lg border bg-background">
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
