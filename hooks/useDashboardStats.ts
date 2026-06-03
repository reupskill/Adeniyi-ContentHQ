"use client"
import { useState, useEffect } from "react"
import type { DashboardStats } from "@/types"

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  return { stats, isLoading }
}
