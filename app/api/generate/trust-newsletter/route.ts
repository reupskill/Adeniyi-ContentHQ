export const dynamic = "force-dynamic"
export const maxDuration = 120

import { requireAuth } from "@/lib/requireAuth"
import { anthropic, CLAUDE_MODEL, generateContent } from "@/lib/claude"
import { createServerClient } from "@/lib/supabase/server"

const NEWSLETTER_SYSTEM = `You are the voice behind "The Trust Economy Brief" — a daily LinkedIn newsletter by Adeniyi, a founder and product leader.

The Trust Economy Brief is one of LinkedIn's most respected daily newsletters for founders, product leaders, operators, and builders in Africa and globally. Readers subscribe because every edition leaves them smarter, more informed, and with a clearer sense of how trust, accountability, and institutional credibility are shaping the next decade of business.

Central thesis: The companies, markets, and leaders that will win are not the fastest or best-funded. They are the ones that earn trust, prove accountability, and build systems that withstand scrutiny.

## Adeniyi's Voice
- Authoritative but warm
- Analytical but personal — writes from lived experience as a founder and product builder
- Globally fluent, specifically grounded in African and emerging-market realities
- Opinionated, not inflammatory
- Writes in clean paragraphs — no bullet points in the main narrative
- Uses specific names, numbers, and examples whenever possible
- Leaves readers with something they can use

## Newsletter Format (write all sections — no labels, just prose with clear structural rhythm)

**Headline**: [Sharp, specific, 8-12 words. Should make a subscriber open immediately.]

**Deck**: [One sentence that deepens the headline. Creates intrigue.]

---

Opening (2 paragraphs): Start with a broader truth, a provocative observation, or a specific moment that frames why today's story matters. Do NOT open with "Today," "In this issue," or the story summary. Open with a statement that would make a thoughtful founder stop scrolling.

The Story (2-3 paragraphs): Report what actually happened — who, what, when, the key numbers and decisions. Write like a sharp analyst, not a news aggregator. Be specific.

The Trust Economy Angle (3 paragraphs): This is the intellectual heart of every edition. Why does this story matter through the lens of trust, governance, accountability, or institutional credibility? What structural shift does it reveal? What does it mean for the future of business, regulation, and markets? Be bold. Be specific. Connect dots the reader won't find elsewhere.

Who's Getting This Right (1-2 paragraphs): Name companies, founders, regulators, or market participants who are ahead of this. What are they building or doing differently? Give the reader something to study.

The Operator's Lens (2 paragraphs): Make this personal and specific for the reader who is building — especially in Africa and emerging markets. What should they do, think about, or build differently because of this story? Give a specific, actionable implication.

Today's Discipline (1 paragraph, bold statement): One crisp mental model or principle the reader can apply immediately. This is the most quotable paragraph in the edition. Make it land.

Sign-off: A brief, warm, forward-looking close in Adeniyi's voice (2-3 lines). Examples of the right tone: "Trust is not a strategy. It's the result of a thousand small decisions made consistently. Keep building." or "The builders who understand this moment will look prescient in five years. You now understand it." End with "Build with trust. / Adeniyi"

Footer line: "The Trust Economy Brief publishes daily. If this edition was useful, share it with one founder who needs to read it."

## Quality Bar
- 950–1150 words total
- Every paragraph earns its place — no filler, no repetition
- Specific > general, always
- The reader must finish smarter than they started
- Must feel handwritten, not AI-generated — use natural transitions, vary sentence length, let the voice breathe`

const LINKEDIN_POST_SYSTEM = `Write a short LinkedIn personal post (150-200 words) for Adeniyi to publish on his personal LinkedIn profile to drive traffic to today's Trust Economy Brief newsletter.

Requirements:
- First 2 lines must work as the hook (before "see more" is clicked on LinkedIn)
- Reference "The Trust Economy Brief" naturally in the body
- Share the sharpest insight from today's edition — make the reader feel they're missing something if they don't subscribe
- Sound personal and direct, not like a newsletter promotion
- Use line breaks strategically — one strong idea per short paragraph
- End with a clear CTA to subscribe to the newsletter
- Do not use hashtags
- Do not start with "Today"
- Tone: the same as Adeniyi's newsletter — smart, direct, personal

The post should make a founder or product leader stop scrolling and want to read the full newsletter immediately.`

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const { headline, storyBody } = await req.json()
    if (!headline?.trim()) return new Response(JSON.stringify({ error: "Headline required" }), { status: 400 })

    const userPrompt = `Write today's Trust Economy Brief newsletter edition based on this story:

**Story:** ${headline}

**Context and details:**
${storyBody}

Write the complete newsletter edition — all sections, full length (950-1150 words), in Adeniyi's voice. Make it exceptional. This is what subscribers are opening their LinkedIn for today.`

    const encoder = new TextEncoder()
    let fullNewsletterText = ""

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Stream the newsletter
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

          // Generate the short LinkedIn personal post
          const linkedinPost = await generateContent(
            LINKEDIN_POST_SYSTEM,
            `Today's newsletter story: "${headline}"\n\nKey angle from today's edition:\n${storyBody.slice(0, 600)}`,
            600
          )

          // Save to content_items as a Newsletter
          const db = createServerClient()
          const { data: saved } = await db.from("content_items").insert({
            title: `Trust Economy Brief: ${headline}`,
            platform: "Newsletter",
            category: "Trust Economy",
            status: "Draft",
            content: fullNewsletterText,
            raw_inputs: { headline, storyBody: storyBody.slice(0, 500), source: "trust-brief" },
            metadata: { linkedinTeaser: linkedinPost, series: "trust-economy-brief" },
          }).select("id").single()

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, linkedinPost, id: saved?.id })}\n\n`))
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (e) {
          console.error("[trust-newsletter stream]", e)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Generation failed" })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    })
  } catch (e) {
    console.error("[trust-newsletter]", e)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}
