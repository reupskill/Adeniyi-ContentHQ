"use client"
import { useState, useEffect } from "react"
import { PLATFORM_DEFAULTS, GeneratorInputs } from "@/components/generators/InputPanel"
import type { ContentItem } from "@/types"

type Platform = "video" | "linkedin" | "twitter" | "substack"

export function useGeneratorInit(platform: Platform) {
  const defaults = PLATFORM_DEFAULTS[platform]
  const [inputs, setInputs] = useState<GeneratorInputs>(defaults)
  const [prefilled, setPrefilled] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")
    const idea = params.get("idea")
    const hook = params.get("hook")

    if (id) {
      fetch(`/api/content/${id}`)
        .then((r) => r.json())
        .then((item: ContentItem) => {
          const raw = (item.rawInputs || {}) as Record<string, string>
          setInputs({
            ...defaults,
            idea: raw.idea || item.title || "",
            story: raw.story || "",
            audience: raw.audience || defaults.audience,
            lesson: raw.lesson || "",
            tone: raw.tone || defaults.tone,
            category: raw.category || item.category || defaults.category,
            philosophy: raw.philosophy || defaults.philosophy,
            cta: raw.cta || defaults.cta,
            business: raw.business || "",
            variations: Number(raw.variations) || 1,
          })
          setPrefilled(item.title)
        })
        .catch(() => {})
    } else if (idea) {
      setInputs((prev) => ({ ...prev, idea, story: hook || prev.story }))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return { inputs, setInputs, prefilled }
}
