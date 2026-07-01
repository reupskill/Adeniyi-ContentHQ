export const dynamic = "force-dynamic"

export const maxDuration = 60

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { generateContent } from "@/lib/claude"
import { SYSTEM_PROMPTS } from "@/lib/prompts"
import { createServerClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import type { ContentRiverOutput } from "@/types"

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const body = await req.json()
    const { content, platform } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: "Paste some content to get started" }, { status: 400 })
    }

    const contextLines = [
      `Platform this was originally for: ${platform || "LinkedIn"}`,
      ``,
      `Content:`,
      content.trim(),
    ].join("\n")

    const raw = await generateContent(SYSTEM_PROMPTS.contentRiver, contextLines, 3000)

    let output: ContentRiverOutput
    try {
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
      output = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: "Failed to parse response. Please retry." }, { status: 500 })
    }

    const db = createServerClient()
    await db.from("daily_inspirations").insert({
      inputs: body,
      content_ideas: output.freshAngles,
      video_hooks: output.videoHooks,
      linkedin_angles: output.linkedinAngles,
      x_post_ideas: output.xPostIdeas,
      substack_angles: output.substackAngles,
      story_prompts: output.pullQuotes,
      philosophical_connections: output.relatedTopics,
      business_metaphors: [],
      raw_output: raw,
    })

    return NextResponse.json(output)
  } catch (e) {
    console.error("[content-river]", e)
    if (e instanceof Anthropic.APIError) {
      if (e.status === 529) return NextResponse.json({ error: "Claude is overloaded. Please retry in 30 seconds." }, { status: 503 })
      if (e.status === 429) return NextResponse.json({ error: "Rate limit reached. Please wait a moment." }, { status: 429 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
