"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createJob } from "@/app/actions/jobs"
import { JobStatus, JobPriority } from "@/types/job"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AddJobDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)

    try {
      const dateApplied = formData.get("date_applied") as string
      const dateInterview = formData.get("date_of_interview") as string

      await createJob({
        company: formData.get("company") as string,
        position: formData.get("position") as string,
        status: formData.get("status") as JobStatus,
        priority: formData.get("priority") as JobPriority,
        date_applied: dateApplied || null,
        date_of_interview: dateInterview || null,
      })

      setOpen(false)
      router.refresh()
      // Force a hard refresh of the jobs page
      window.location.reload()
    } catch (error) {
      console.error("Error creating job:", error)
      alert(error instanceof Error ? error.message : "Failed to create job")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add Application</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Application</DialogTitle>
        </DialogHeader>

        <form action={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input id="position" name="position" required />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select name="status" defaultValue="applied">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select name="priority" defaultValue="medium">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_applied">Date Applied</Label>
            <Input 
              id="date_applied" 
              name="date_applied" 
              type="date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_interview">Date of Interview</Label>
            <Input 
              id="date_of_interview" 
              name="date_of_interview" 
              type="date"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}