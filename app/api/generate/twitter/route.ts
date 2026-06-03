import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { generateContent } from "@/lib/claude"
import { SYSTEM_PROMPTS } from "@/lib/prompts"
import { createServerClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"

function parseTweets(raw: string): string[] {
  const tweetRegex = /TWEET\s+\d+[:\s]+([\s\S]*?)(?=TWEET\s+\d+|$)/gi
  const matches: RegExpExecArray[] = []
  let m: RegExpExecArray | null
  while ((m = tweetRegex.exec(raw)) !== null) matches.push(m)
  if (matches.length > 0) {
    return matches.map((match) => match[1].trim()).filter(Boolean)
  }
  return raw.split("\n\n").map((t) => t.trim()).filter((t) => t.length > 10)
}

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const body = await req.json()
    const { idea, story, audience, lesson, tone, category, philosophy, cta, business, format = "3-thread" } = body

    if (!idea?.trim()) {
      return NextResponse.json({ error: "Core idea is required" }, { status: 400 })
    }

    const formatInstructions: Record<string, string> = {
      "one-liner": "Write a single sharp tweet under 280 characters.",
      "3-thread": "Write a 3-tweet thread. Label each: TWEET 1, TWEET 2, TWEET 3. Under 280 chars each.",
      "5-thread": "Write a 5-tweet thread. Label each: TWEET 1 through TWEET 5. Under 280 chars each.",
      "founder": "Write a single tweet from a founder's perspective — a sharp, contrarian observation from building.",
      "growth": "Write a single tweet sharing a growth or business lesson from lived experience.",
    }

    const userPrompt = `Core Idea: ${idea}
${story ? `Personal Story: ${story}` : ""}
${audience ? `Target Audience: ${audience}` : ""}
${lesson ? `Main Lesson: ${lesson}` : ""}
Tone: ${tone || "Direct"}
Category: ${category || "Founder Lesson"}
Philosophical Lens: ${philosophy || "None"}
CTA: ${cta || "None"}
${business ? `Business Context: ${business}` : ""}

${formatInstructions[format] || formatInstructions["3-thread"]}`

    const raw = await generateContent(SYSTEM_PROMPTS.twitter, userPrompt, 1200)
    const tweets = parseTweets(raw)
    const isThread = format.includes("thread")

    const db = createServerClient()
    const title = idea.slice(0, 80) + (idea.length > 80 ? "…" : "")
    const { data: saved } = await db.from("content_items").insert({
      title,
      platform: "X",
      category: category || "Founder Lesson",
      status: "Draft",
      content: raw,
      raw_inputs: body,
      metadata: { tweets, format, isThread },
    }).select("id").single()

    return NextResponse.json({ id: saved?.id, tweets, format, raw })
  } catch (e) {
    console.error("[twitter]", e)
    if (e instanceof Anthropic.APIError) {
      if (e.status === 529) return NextResponse.json({ error: "Claude is overloaded. Please retry in 30 seconds." }, { status: 503 })
      if (e.status === 429) return NextResponse.json({ error: "Rate limit reached. Please wait a moment." }, { status: 429 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
