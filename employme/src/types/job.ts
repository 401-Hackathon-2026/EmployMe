export type JobStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "offer"
  | "rejected"

export type JobPriority = "low" | "medium" | "high"

export interface Job {
  id: string
  company: string
  position: string
  status: JobStatus
  priority: JobPriority
  date_applied: string | null
  next_action: string | null
  next_action_date: string | null
  created_at: string
}
