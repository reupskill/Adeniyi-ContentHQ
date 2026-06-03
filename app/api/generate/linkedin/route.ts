export const maxDuration = 30

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { generateContent } from "@/lib/claude"
import { SYSTEM_PROMPTS } from "@/lib/prompts"
import { createServerClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const body = await req.json()
    const { idea, story, audience, lesson, tone, category, philosophy, cta, business, variations = 1, sourceContentId } = body

    if (!idea?.trim()) {
      return NextResponse.json({ error: "Core idea is required" }, { status: 400 })
    }

    let sourceContext = ""
    if (sourceContentId) {
      const db = createServerClient()
      const { data: source } = await db.from("content_items").select("content, title").eq("id", sourceContentId).single()
      if (source) {
        sourceContext = `\n\nSource script for reference:\n"${source.title}"\n${source.content.slice(0, 500)}...`
      }
    }

    const userPrompt = `Core Idea: ${idea}
${story ? `Personal Story: ${story}` : ""}
${audience ? `Target Audience: ${audience}` : ""}
${lesson ? `Main Lesson: ${lesson}` : ""}
Tone: ${tone || "Reflective"}
Category: ${category || "Founder Lesson"}
Philosophical Lens: ${philosophy || "Stoicism"}
CTA: ${cta || "Reflection question"}
${business ? `Business Context: ${business}` : ""}
${sourceContext}
${variations > 1 ? `Generate ${variations} variations, separated by ---` : ""}

Write a LinkedIn post.`

    const raw = await generateContent(SYSTEM_PROMPTS.linkedin, userPrompt, 2000)
    const posts = raw.split("---").map((p) => p.trim()).filter(Boolean)

    const db = createServerClient()
    const title = idea.slice(0, 80) + (idea.length > 80 ? "…" : "")
    const savedIds: string[] = []

    for (const post of posts) {
      const { data: saved } = await db.from("content_items").insert({
        title,
        platform: "LinkedIn",
        category: category || "Founder Lesson",
        status: "Draft",
        content: post,
        raw_inputs: body,
      }).select("id").single()
      if (saved) savedIds.push(saved.id)
    }

    return NextResponse.json({ ids: savedIds, posts, raw })
  } catch (e) {
    console.error("[linkedin]", e)
    if (e instanceof Anthropic.APIError) {
      if (e.status === 529) return NextResponse.json({ error: "Claude is overloaded. Please retry in 30 seconds." }, { status: 503 })
      if (e.status === 429) return NextResponse.json({ error: "Rate limit reached. Please wait a moment." }, { status: 429 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
