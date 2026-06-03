export const dynamic = "force-dynamic"

export const maxDuration = 60

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { streamContent } from "@/lib/claude"
import { SYSTEM_PROMPTS } from "@/lib/prompts"
import { createServerClient } from "@/lib/supabase/server"
import { parseSubstackSections } from "@/lib/utils"

export async function POST(req: Request) {
  const { error } = await requireAuth()
  if (error) return error

  const body = await req.json()
  const { idea, story, audience, lesson, tone, category, philosophy, cta, business } = body

  if (!idea?.trim()) {
    return NextResponse.json({ error: "Core idea is required" }, { status: 400 })
  }

  const userPrompt = `Core Idea: ${idea}
${story ? `Personal Story: ${story}` : ""}
${audience ? `Target Audience: ${audience}` : ""}
${lesson ? `Main Lesson: ${lesson}` : ""}
Tone: ${tone || "Reflective"}
Category: ${category || "Philosophy"}
Philosophical Lens: ${philosophy || "Stoicism"}
CTA: ${cta || "Newsletter CTA"}
${business ? `Business Context: ${business}` : ""}

Write a full Substack essay.`

  const encoder = new TextEncoder()
  let fullText = ""

  const stream = new ReadableStream({
    async start(controller) {
      try {
        await streamContent(SYSTEM_PROMPTS.substack, userPrompt, (chunk) => {
          fullText += chunk
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
        })

        const sections = parseSubstackSections(fullText)
        const db = createServerClient()
        const title = idea.slice(0, 80) + (idea.length > 80 ? "…" : "")
        const { data: saved } = await db.from("content_items").insert({
          title,
          platform: "Substack",
          category: category || "Philosophy",
          status: "Draft",
          content: fullText,
          raw_inputs: body,
          metadata: { sections },
        }).select("id").single()

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true, id: saved?.id, sections })}\n\n`)
        )
        controller.enqueue(encoder.encode("data: [DONE]\n\n"))
        controller.close()
      } catch (e) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: "Generation failed" })}\n\n`)
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
