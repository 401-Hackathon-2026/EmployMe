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
  date_interviwed: string | null
  date_accepted: string | null
  date_rejected: string | null
  created_at: string
}
