export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { generateContent } from "@/lib/claude"

const SYSTEM = `You are a content strategist and ghostwriter for Adeniyi — a founder, product leader, and thought leadership voice focused on the Trust Economy (trust, fintech, AI, governance, growth, leadership, culture, emerging markets especially Africa).

Generate platform-native content from a single idea. For each requested platform, produce content that matches that platform's format, voice, and expectations while staying true to Adeniyi's positioning:

- LinkedIn: Storytelling + reflective. Categories: Leadership, Growth, Building, Founder Lesson. 150-250 words. Professional but personal. Clear business lesson. End with reflection question.
- X/Twitter: Direct + provocative. Categories: Leadership, Building. 3-5 tweets, 280 chars max each. Thread format. Sharp hook in tweet 1.
- Video: Conversational + storytelling. Categories: Mindset, Building, Leadership, Philosophy. 45-60 second script. Sections: hook, story, insight, close, caption.
- Substack: Philosophical + reflective. Categories: Philosophy, Focus, Mindset, Discipline. Essay outline: title, subtitle, opening, 3 sections, closing insight.

Return a valid JSON object with only the requested platform keys:
{
  "linkedin": "full post text",
  "x": ["tweet 1", "tweet 2", "tweet 3"],
  "video": { "hook": "...", "story": "...", "insight": "...", "close": "...", "caption": "..." },
  "substack": { "title": "...", "subtitle": "...", "opening": "...", "section1": "...", "section2": "...", "section3": "...", "closing": "..." }
}

Return JSON only. No markdown fences, no explanation.`

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const { idea, platforms } = await req.json()
    if (!idea?.trim()) return NextResponse.json({ error: "Idea is required" }, { status: 400 })
    if (!platforms?.length) return NextResponse.json({ error: "Select at least one platform" }, { status: 400 })

    const user = `Idea: ${idea}

Generate content for these platforms: ${platforms.join(", ")}

Write in Adeniyi's voice — strategic, direct, opinionated, with specific insight for founders, product leaders, and builders. Make each piece platform-native and ready to publish.`

    const raw = await generateContent(SYSTEM, user, 3500)
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("No JSON in response")
    const content = JSON.parse(jsonMatch[0])
    return NextResponse.json({ content })
  } catch (e) {
    console.error("[content-lab]", e)
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}
