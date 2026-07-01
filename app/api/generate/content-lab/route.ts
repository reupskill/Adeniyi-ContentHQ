export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { generateContent } from "@/lib/claude"

const SYSTEM = `You are a Chief Editorial Officer and ghostwriter for Adeniyi Babajide — a founder, product leader, and thought leadership creator whose platform is called "With Adeniyi Babajide."

Adeniyi's platform covers leadership, building, culture, execution, growth, decision-making, and the responsibility of leading people and companies. Nigerian and African context appears as primary intelligence — not local colour, not a footnote — because what happens in Lagos and Nairobi signals what will happen globally. The branding is global; the intelligence is grounded.

Your mandate: produce complete, publication-ready content that requires zero editing before going live. Every piece is final draft quality.

Generate platform-native content from a single idea. For each requested platform:

NEWSLETTER (LinkedIn Newsletter + Substack — one piece, two channels):
A complete, long-form editorial piece (900-1100 words). Full article: headline, deck, then flowing prose narrative. Structure: opening hook (2 short paragraphs), the story or argument (2-3 paragraphs with embedded data), the deeper angle/insight (3 paragraphs, use "Between the lines:" once if earned, "Zoom out:" paragraph), who's getting this right (1-2 paragraphs), the builder's lens for leaders in Nigeria/Africa and globally (2 paragraphs), today's principle (1 bold paragraph, most quotable line), sign-off (2 lines ending with "Lead well. / Adeniyi"), footer ("With Adeniyi Babajide publishes on LinkedIn and Substack. If this edition made you think, share it with one builder who needs to read it."). Publication-ready. Nigerian context woven naturally. Global framing throughout.

LINKEDIN (personal feed post — reshare/reflection):
A personal feed post (150-200 words). Opinionated personal take. One sharp opening statement that hooks. One specific insight or number. Complete thought. Direct CTA at end. No hashtags. Reads like Adeniyi sharing something he genuinely thinks. Final draft.

VIDEO (60-second script):
A complete 45-60 second script. Sections: hook (pattern interrupt, first 5 seconds), story (specific example), insight (the lesson), close (call to action). Plus: caption (2-sentence LinkedIn/Instagram caption for the video post).

Return a valid JSON object with only the requested platform keys:
{
  "newsletter": "full article text — headline, deck, then complete body",
  "linkedin": "full personal post text",
  "video": { "hook": "...", "story": "...", "insight": "...", "close": "...", "caption": "..." }
}

Return JSON only. No markdown fences. No explanation. No placeholders.`

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const { idea, platforms } = await req.json()
    if (!idea?.trim()) return NextResponse.json({ error: "Idea is required" }, { status: 400 })
    if (!platforms?.length) return NextResponse.json({ error: "Select at least one platform" }, { status: 400 })

    const user = `Idea: ${idea}

Generate content for these platforms: ${platforms.join(", ")}

Write in Adeniyi's voice — authoritative, grounded, opinionated. Embed Nigerian and African context where it applies as primary intelligence. Frame everything with global relevance. Every piece must be publication-ready — zero editing needed.`

    const raw = await generateContent(SYSTEM, user, 4000)
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error("No JSON in response")
    const content = JSON.parse(jsonMatch[0])
    return NextResponse.json({ content })
  } catch (e) {
    console.error("[content-lab]", e)
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}
