"use client"
import { useState, useEffect, useCallback } from "react"
import type { ContentItem, Platform, ContentStatus } from "@/types"

interface Filters {
  platform?: Platform | "All"
  status?: ContentStatus | "All"
  search?: string
}

export function useContentBank(initialFilters: Filters = {}) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState(initialFilters)

  const fetchItems = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.platform && filters.platform !== "All") params.set("platform", filters.platform)
      if (filters.status && filters.status !== "All") params.set("status", filters.status)
      if (filters.search) params.set("search", filters.search)
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
  }, [filters])

  useEffect(() => { fetchItems() }, [fetchItems])

  const updateStatus = useCallback(async (id: string, status: ContentStatus) => {
    const res = await fetch(`/api/content/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error("Failed to update")
    setItems((cur) => cur.map((it) => (it.id === id ? { ...it, status } : it)))
  }, [])

  const deleteItem = useCallback(async (id: string) => {
    const res = await fetch(`/api/content/${id}`, { method: "DELETE" })
    if (!res.ok) throw new Error("Failed to delete")
    setItems((cur) => cur.filter((it) => it.id !== id))
    setTotal((t) => t - 1)
  }, [])

  return {
    items,
    total,
    isLoading,
    filters,
    setFilters,
    updateStatus,
    deleteItem,
    refresh: fetchItems,
  }
}
