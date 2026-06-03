"use client"
import { useState } from "react"

interface UseGenerateOptions {
  endpoint: string
  onSuccess?: (data: unknown) => void
  onError?: (error: string) => void
}

export function useGenerate({ endpoint, onSuccess, onError }: UseGenerateOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<unknown>(null)

  async function generate(body: Record<string, unknown>) {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Generation failed")
      }
      const result = await res.json()
      setData(result)
      onSuccess?.(result)
      return result
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong"
      setError(msg)
      onError?.(msg)
      throw e
    } finally {
      setIsLoading(false)
    }
  }

  return { generate, isLoading, error, data, setData }
}
