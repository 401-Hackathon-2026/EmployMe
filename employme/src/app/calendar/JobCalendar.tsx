"use client"

import React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import type { EventClickArg } from "@fullcalendar/core"

export default function JobCalendar() {
  return (
    <div className="rounded-lg border p-3">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        eventSources={[
          {
            events: async (info, success, failure) => {
              try {
                const startDate = new Date(info.start)
                startDate.setMonth(startDate.getMonth() - 3)
                
                const endDate = new Date(info.end)
                endDate.setMonth(endDate.getMonth() + 3)

                const url = new URL("/api/calendar-events", window.location.origin)
                url.searchParams.set("start", startDate.toISOString().slice(0, 10))
                url.searchParams.set("end", endDate.toISOString().slice(0, 10))

                const res = await fetch(url.toString(), { cache: "no-store" })
                if (!res.ok) throw new Error("Failed to load events")
                success(await res.json())
              } catch (e) {
                failure(e instanceof Error ? e : new Error(String(e)))
              }
            },
          },
        ]}
        eventClick={(arg: EventClickArg) => {
          const jobId = arg.event.extendedProps.jobId as string | undefined
          if (jobId) window.location.href = `/jobs/${jobId}`
        }}
      />
    </div>
  )
}