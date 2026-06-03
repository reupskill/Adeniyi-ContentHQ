export const dynamic = "force-dynamic"

export const maxDuration = 30

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { generateContent } from "@/lib/claude"
import { SYSTEM_PROMPTS } from "@/lib/prompts"
import { createServerClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import type { ScriptScores } from "@/types"

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const { contentItemId, content } = await req.json()

    let scriptText = content
    if (!scriptText && contentItemId) {
      const db = createServerClient()
      const { data } = await db.from("content_items").select("content").eq("id", contentItemId).single()
      scriptText = data?.content
    }

    if (!scriptText?.trim()) {
      return NextResponse.json({ error: "No script content to analyse" }, { status: 400 })
    }

    const raw = await generateContent(SYSTEM_PROMPTS.scriptAnalyser, scriptText, 800)

    let scores: ScriptScores
    try {
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
      scores = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: "Failed to parse analysis. Please retry." }, { status: 500 })
    }

    if (contentItemId) {
      const db = createServerClient()
      await db.from("content_items").update({
        score_overall: scores.overall,
        score_hook: scores.hookStrength,
        score_clarity: scores.clarity,
        score_depth: scores.depth,
        score_emotional_impact: scores.emotionalImpact,
        score_cta: scores.callToAction,
        score_tip: scores.tip,
      }).eq("id", contentItemId)
    }

    return NextResponse.json(scores)
  } catch (e) {
    console.error("[analyse-script]", e)
    if (e instanceof Anthropic.APIError) {
      if (e.status === 529) return NextResponse.json({ error: "Claude is overloaded. Please retry in 30 seconds." }, { status: 503 })
      if (e.status === 429) return NextResponse.json({ error: "Rate limit reached. Please wait a moment." }, { status: 429 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
