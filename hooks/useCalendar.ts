"use client"
import { useState, useEffect, useCallback } from "react"
import type { CalendarDay } from "@/types"

export function useCalendar(initialMonth?: string) {
  const [days, setDays] = useState<CalendarDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [month, setMonth] = useState(
    initialMonth || new Date().toISOString().slice(0, 7)
  )

  const fetchCalendar = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/calendar?month=${month}`)
      if (!res.ok) throw new Error("Failed to fetch calendar")
      const data = await res.json()
      setDays(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [month])

  useEffect(() => { fetchCalendar() }, [fetchCalendar])

  const generatePlan = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/calendar/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month }),
      })
      if (!res.ok) throw new Error("Failed to generate plan")
      const data = await res.json()
      setDays(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [month])

  const updateDay = useCallback(async (date: string, updates: Partial<CalendarDay>) => {
    const res = await fetch(`/api/calendar/${date}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error("Failed to update day")
    const updated = await res.json()
    setDays((cur) =>
      cur.map((d) => (d.calendarDate === date ? { ...d, ...updated } : d))
    )
  }, [])

  return { days, isLoading, month, setMonth, generatePlan, updateDay, refresh: fetchCalendar }
}
