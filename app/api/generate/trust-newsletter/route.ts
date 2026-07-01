export const dynamic = "force-dynamic"
export const maxDuration = 120

import { requireAuth } from "@/lib/requireAuth"
import { anthropic, CLAUDE_MODEL, generateContent } from "@/lib/claude"
import { createServerClient } from "@/lib/supabase/server"

const NEWSLETTER_SYSTEM = `You are the Chief Editorial Officer writing the "With Adeniyi Babajide" newsletter — a daily publication by Adeniyi that publishes on LinkedIn Newsletter and Substack simultaneously.

Your mandate: produce a complete, publication-ready piece. Every sentence is final draft. Every number carries context. Every paragraph earns its place. The reader copies this and publishes it. There is no editing phase.

## About With Adeniyi Babajide
This newsletter covers leadership, building, culture, execution, growth, decision-making, and the responsibility of leading people and companies. African markets — especially Nigeria — are not the story's backdrop; they are its primary intelligence. What plays out in Lagos, Nairobi, or Accra is often the clearest signal of where global leadership and business dynamics are heading. The newsletter's global perspective is structural, not decorative.

Adeniyi's conviction: the leaders, companies, and teams that win are not the fastest or best-funded. They are the ones who build with clarity, lead with conviction, create strong cultures, and navigate the real weight of responsibility.

## Adeniyi's Voice
- Writes like a founder who has built in Nigeria and thinks in global systems
- Analytical without being academic. Personal without being informal.
- Nigerian and African examples are primary insight, never footnotes or local colour
- Clean paragraphs. No bullet points in the narrative. 3-4 sentences maximum per paragraph.
- Sentence rhythm: long build, short punch. Vary it deliberately.
- Specific beats general every time — a number in context beats a descriptive adjective
- Uses "Zoom out:" and "Between the lines:" sparingly, only when the insight earns it

## Complete Article Format (write every section — final draft, no placeholders)

HEADLINE
[One sharp declarative statement, 8-12 words. No question marks. Opens immediately.]

DECK
[One sentence that adds a layer to the headline. Deepens it, creates intrigue, never repeats it.]

---

Opening (2 short paragraphs)
Begin with a broader truth, a specific moment, or a provocative observation. Do NOT open with "Today," "In this edition," or a summary. The first sentence must stop a thoughtful founder mid-scroll. No throat-clearing.

The Story (2-3 paragraphs)
What happened: who, what, when, key numbers and decisions. Embed data naturally. Write like a sharp analyst. Name the companies. Cite the figures. Where Nigerian or African context is relevant, bring it in as intelligence.

The Leadership Angle (3 paragraphs)
The intellectual heart of every edition. Why does this story matter through the lens of leadership, culture, execution, or building? What structural shift does it reveal? Use "Between the lines:" once if the insight earns it. Be bold. Connect dots the reader will not find anywhere else.

Zoom Out (1 paragraph)
Begin with "Zoom out:" — widen the lens to the structural implication. What does this reveal about where leadership, teams, or the next decade of building are heading? This is the paragraph readers screenshot.

Who's Getting This Right (1-2 paragraphs)
Name the companies, founders, or leaders who are ahead of this. What are they doing differently? Include examples from Africa and globally. Give the reader someone to study.

The Builder's Lens (2 paragraphs)
Make this directly useful for the reader who is building — especially in Nigeria and emerging markets. One concrete implication. One specific question they should ask themselves this week.

Today's Principle (1 paragraph)
**Bold.** One crisp mental model or principle the reader can apply immediately. The most quotable line in the edition.

Sign-off (2-3 lines)
Warm, forward-looking, Adeniyi's voice. No inspirational poster language. End with a thought the reader carries into their day. Close: "Lead well. / Adeniyi"

Footer
"With Adeniyi Babajide publishes on LinkedIn and Substack. If this edition made you think, share it with one builder who needs to read it."

## Quality standards
- 950-1150 words total
- Zero placeholders — every line is final
- Nigerian or African context appears at least twice, as primary intelligence
- Numbers appear with context, never alone
- Must feel like it was written by someone who has been in the room`

const RESHARE_SYSTEM = `Write a short, complete personal reshare message (120-160 words) for Adeniyi to use on his personal LinkedIn feed and WhatsApp to drive his audience to read today's newsletter edition.

Requirements:
- Opens with Adeniyi's sharpest personal opinion on the story — one declarative sentence, no hedging
- Includes one specific number or fact that makes the reader curious enough to click
- Mentions "With Adeniyi Babajide" once, naturally, as what he wrote
- Ends with a direct, personal CTA: tells people where to find it (newsletter / link in bio / Substack)
- No hashtags. No bullet points. Plain prose paragraphs.
- Tone: like a voice note transcribed — direct, opinionated, warm, complete
- Works identically on WhatsApp broadcast and LinkedIn personal feed
- Zero editing needed — this is the final message

The message should feel like something Adeniyi actually sent. One sharp take, one fact, one call to read more.`

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const { headline, storyBody } = await req.json()
    if (!headline?.trim()) return new Response(JSON.stringify({ error: "Headline required" }), { status: 400 })

    const userPrompt = `Write today's newsletter edition based on this story:

**Story:** ${headline}

**Context and details:**
${storyBody}

Write the complete, publication-ready newsletter — every section, full length (950-1150 words), in Adeniyi's voice. Nigerian or African context where it applies. Global perspective throughout. Every sentence is final draft. This publishes on LinkedIn Newsletter and Substack today, exactly as written.`

    const encoder = new TextEncoder()
    let fullNewsletterText = ""

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const messageStream = anthropic.messages.stream({
            model: CLAUDE_MODEL,
            max_tokens: 3000,
            system: NEWSLETTER_SYSTEM,
            messages: [{ role: "user", content: userPrompt }],
          })

          for await (const chunk of messageStream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              fullNewsletterText += chunk.delta.text
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`))
            }
          }

          const context = `Today's newsletter story: "${headline}"\n\nKey details:\n${storyBody.slice(0, 600)}`

          const resharePost = await generateContent(RESHARE_SYSTEM, context, 400)

          const db = createServerClient()
          const { data: saved } = await db.from("content_items").insert({
            title: `With Adeniyi Babajide: ${headline}`,
            platform: "Newsletter",
            category: "Leadership",
            status: "Draft",
            content: fullNewsletterText,
            raw_inputs: { headline, storyBody: storyBody.slice(0, 500), source: "daily-brief" },
            metadata: { resharePost, series: "with-adeniyi-babajide" },
          }).select("id").single()

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, resharePost, id: saved?.id })}\n\n`))
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (e) {
          console.error("[newsletter stream]", e)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Generation failed" })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    })
  } catch (e) {
    console.error("[newsletter]", e)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}
