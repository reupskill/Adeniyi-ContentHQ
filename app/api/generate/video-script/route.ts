export const dynamic = "force-dynamic"

export const maxDuration = 30

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { generateContent } from "@/lib/claude"
import { SYSTEM_PROMPTS } from "@/lib/prompts"
import { createServerClient } from "@/lib/supabase/server"
import { parseVideoScriptSections } from "@/lib/utils"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const body = await req.json()
    const { idea, story, audience, lesson, tone, category, philosophy, cta, business, variations = 1 } = body

    if (!idea?.trim()) {
      return NextResponse.json({ error: "Core idea is required" }, { status: 400 })
    }

    const userPrompt = `Core Idea: ${idea}
${story ? `Personal Story: ${story}` : ""}
${audience ? `Target Audience: ${audience}` : ""}
${lesson ? `Main Lesson: ${lesson}` : ""}
Tone: ${tone || "Reflective"}
Content Category: ${category || "Philosophy"}
Philosophical Lens: ${philosophy || "Stoicism"}
CTA Type: ${cta || "Reflection question"}
${business ? `Business Lens: ${business}` : ""}
${variations > 1 ? `Generate ${variations} variations, separated by ---` : ""}

Write a 45-60 second video script.`

    const raw = await generateContent(SYSTEM_PROMPTS.videoScript, userPrompt, 2000)
    const sections = parseVideoScriptSections(raw)

    const db = createServerClient()
    const title = idea.slice(0, 80) + (idea.length > 80 ? "…" : "")
    const { data: saved } = await db.from("content_items").insert({
      title,
      platform: "Video",
      category: category || "Philosophy",
      status: "Draft",
      content: raw,
      raw_inputs: body,
      metadata: { sections, variations },
    }).select().single()

    return NextResponse.json({ id: saved?.id, sections, raw })
  } catch (e) {
    console.error("[video-script]", e)
    if (e instanceof Anthropic.APIError) {
      if (e.status === 529) return NextResponse.json({ error: "Claude is overloaded. Please retry in 30 seconds." }, { status: 503 })
      if (e.status === 429) return NextResponse.json({ error: "Rate limit reached. Please wait a moment." }, { status: 429 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
