"use client"
import { useState, useEffect, useCallback } from "react"
import type { ContentItem, Platform, ContentStatus } from "@/types"

interface Filters {
  platform?: Platform | "All"
  status?: ContentStatus | "All"
  search?: string
}

export function useContentBank({ platform, status, search }: Filters = {}) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const fetchItems = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (platform && platform !== "All") params.set("platform", platform)
      if (status && status !== "All") params.set("status", status)
      if (search) params.set("search", search)
      params.set("limit", "50")

      const res = await fetch(`/api/content?${params}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setItems(data.items)
      setTotal(data.total)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }, [platform, status, search])

  useEffect(() => { fetchItems() }, [fetchItems])

  const updateStatus = useCallback(async (id: string, newStatus: ContentStatus) => {
    const res = await fetch(`/api/content/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    if (!res.ok) throw new Error("Failed to update")
    setItems((cur) => cur.map((it) => (it.id === id ? { ...it, status: newStatus } : it)))
  }, [])

  const deleteItem = useCallback(async (id: string) => {
    const res = await fetch(`/api/content/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Failed to delete")
    setItems((cur) => cur.filter((it) => it.id !== id))
    setTotal((t) => t - 1)
  }, [])

  return { items, total, isLoading, updateStatus, deleteItem, refresh: fetchItems }
}
