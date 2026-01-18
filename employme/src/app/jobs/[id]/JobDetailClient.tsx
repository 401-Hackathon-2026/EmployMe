"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { updateJob, deleteJob } from "@/app/actions/jobs"
import { Job } from "@/types/job"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function JobDetailClient() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [job, setJob] = useState<Job | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadJob() {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error(error)
        return
      }

      setJob(data)
    }

    loadJob()
  }, [id])

  if (!job) return <p>Loading...</p>

  async function onSave(formData: FormData) {
    if (!job) return
    setLoading(true)

    const updatedJob = {
      ...job,
      company: formData.get("company") as string,
      position: formData.get("position") as string,
      status: formData.get("status") as any,
      priority: formData.get("priority") as any,
    }

    await updateJob(job.id, updatedJob)

    setJob(updatedJob)

    setEditing(false)
    setLoading(false)
  }

  async function onDelete() {
    if (!confirm("Delete this job permanently?")) return
    await deleteJob(job!.id)
    router.push("/jobs")
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Job Detail</h1>

      {!editing ? (
        <>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Position:</strong> {job.position}</p>
          <p><strong>Status:</strong> {job.status}</p>
          <p><strong>Priority:</strong> {job.priority}</p>

          <div className="flex gap-2">
            <Button onClick={() => setEditing(true)}>Edit</Button>
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </>
      ) : (
        <form action={onSave} className="space-y-4">
          <div>
            <Label>Company</Label>
            <Input name="company" defaultValue={job.company} />
          </div>

          <div>
            <Label>Position</Label>
            <Input name="position" defaultValue={job.position} />
          </div>

          <div>
            <Label>Status</Label>
            <Select name="status" defaultValue={job.status}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Priority</Label>
            <Select name="priority" defaultValue={job.priority}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}