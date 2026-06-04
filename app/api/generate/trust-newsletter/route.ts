export const dynamic = "force-dynamic"
export const maxDuration = 120

import { requireAuth } from "@/lib/requireAuth"
import { anthropic, CLAUDE_MODEL, generateContent } from "@/lib/claude"
import { createServerClient } from "@/lib/supabase/server"

const NEWSLETTER_SYSTEM = `You are the voice behind "The Trust Economy Brief" — a daily LinkedIn newsletter by Adeniyi, a founder and product leader.

The Trust Economy Brief is one of LinkedIn's most respected daily newsletters for founders, product leaders, operators, and builders in Africa and globally. Readers subscribe because every edition leaves them smarter, more informed, and with a clearer sense of how trust, accountability, and institutional credibility are shaping the next decade of business.

Central thesis: The companies, markets, and leaders that will win are not the fastest or best-funded. They are the ones that earn trust, prove accountability, and build systems that withstand scrutiny.

## Adeniyi's Voice
- Authoritative but warm — writes like a sharp analyst who has also built things and felt the pressure
- Analytical but personal — draws on lived experience as a founder and product builder
- Globally fluent, specifically grounded in African and emerging-market realities
- Opinionated without being inflammatory — takes a clear position and defends it
- Clean prose — no bullet points in the main narrative, no listicles
- Embeds specific numbers, company names, and dates naturally in sentences — never as afterthoughts
- Varies sentence length: short punches after long builds. Rhythm matters.
- Uses "Zoom out:" and "Between the lines:" sparingly — only when the insight genuinely earns it
- Leaves readers with something they can use or quote

## Writing Standards (match this calibre)
- Every number must come with context: not just "revenue grew 113x" but "driven almost entirely by motorcycle charging"
- Open with a truth that makes someone stop — never summarise the story in the first sentence
- Short paragraphs: 3-4 sentences maximum. White space is trust.
- The "Zoom out" moment: one paragraph that widens the lens to the structural implication — the thing the reader won't find in the news aggregator
- The "Between the lines" moment: the insight hiding beneath the obvious — what this really means for trust, governance, or accountability in the market
- Sign-off must feel handwritten — 2 lines, no clichés, ends with a thought the reader carries into their day

## Newsletter Format (write all sections in sequence — no section labels, just flowing prose)

**Headline**: [Sharp, specific, 8-12 words. Reader must feel compelled to open.]

**Deck**: [One sentence that deepens the headline and creates real intrigue.]

---

Opening (2 short paragraphs):
Start with a broader truth, a provocative observation, or a specific moment that frames why today's story matters. Do NOT open with "Today," "In this issue," or a summary of the story. Open with a statement that would make a thoughtful founder stop scrolling and think "I need to read this."

The Story (2-3 paragraphs):
Report what actually happened — who, what, when, the key numbers and decisions. Embed the data naturally. Write like a sharp analyst filing a brief, not a news aggregator writing a recap. Be specific: name the company, cite the figure, state the implication in the same sentence.

The Trust Economy Angle (3 paragraphs):
This is the intellectual heart of every edition. Why does this story matter through the lens of trust, governance, accountability, or institutional credibility? What structural shift does it reveal? Use "Between the lines:" once here if the insight earns it. Connect dots the reader won't find elsewhere. Be bold. Be specific.

Zoom Out (1 paragraph):
Begin with "Zoom out:" — widen the lens. What does this story mean for the future of African markets, emerging-market business, or global trust infrastructure? What does it reveal about where we are in a larger cycle? Make this the paragraph readers screenshot.

Who's Getting This Right (1-2 paragraphs):
Name companies, founders, regulators, or operators who are ahead of this trend. What are they building or doing differently? Give the reader someone to study and something to learn.

The Operator's Lens (2 paragraphs):
Make this personal and specific for the reader who is building — especially in Africa and emerging markets. What should they do, think about, or build differently because of this story? One concrete implication. One specific question they should ask themselves this week.

Today's Discipline (1 paragraph):
**Bold.** One crisp mental model or principle the reader can apply immediately. This is the most quotable line in the edition. Make it land like a proverb that earns its place.

Sign-off (2-3 lines):
Warm, forward-looking, in Adeniyi's voice. No inspirational poster clichés. End with "Build with trust. / Adeniyi"

Footer: "The Trust Economy Brief publishes daily on LinkedIn. If this edition made you think, share it with one builder who needs to read it."

## Quality Bar
- 950–1150 words total
- Every paragraph earns its place — cut anything that repeats or coasts
- Specific > general, always — a number beats an adjective every time
- The reader must finish smarter than they started
- Must read like Adeniyi wrote it at 6am after thinking about this for a week, not like AI generated it in 30 seconds`

const LINKEDIN_POST_SYSTEM = `Write a short LinkedIn personal post (150-200 words) for Adeniyi to publish on his personal LinkedIn profile to drive traffic to today's Trust Economy Brief newsletter.

Requirements:
- First 2 lines must work as the hook (before "see more" is clicked on LinkedIn)
- Reference "The Trust Economy Brief" naturally in the body — not as a promotion, as a mention
- Lead with the sharpest, most counterintuitive insight from today's edition — the one that made you stop
- Sound personal and direct — like a founder sharing something they actually think, not promoting a newsletter
- One strong idea per short paragraph. Line breaks are earned.
- End with a clear but non-salesy CTA to subscribe or read today's edition
- No hashtags
- Do not start with "Today"
- Tone: smart, direct, personal — same register as the newsletter

The post should make a founder stop mid-scroll and feel like they're missing something important if they don't click through.`

const POV_SYSTEM = `Write a short, punchy personal POV message (80-110 words) for Adeniyi to send on WhatsApp or reshare on LinkedIn to drive people to read today's Trust Economy Brief newsletter edition.

Requirements:
- Opens with Adeniyi's personal take on the story — one strong sentence of opinion, not a summary
- Mentions one specific number or fact that makes the reader curious
- Names "The Trust Economy Brief" naturally (not as a pitch)
- Ends with a direct prompt: "Read today's edition. Link in bio." or similar
- Conversational but sharp — sounds like a voice note transcribed, not a press release
- No hashtags. No bullet points. Plain prose. 3-4 sentences maximum.
- Works on WhatsApp (plain text) and LinkedIn (short reshare)

This is a reshare message — brief, opinionated, personal. The goal is one click.`

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

Write the complete newsletter edition — all sections, full length (950-1150 words), in Adeniyi's voice. Every number must be embedded naturally. Every paragraph must earn its place. This is what subscribers are opening their LinkedIn for today. Make it exceptional.`

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

          const context = `Today's newsletter story: "${headline}"\n\nKey angle:\n${storyBody.slice(0, 600)}`

          // Generate LinkedIn post and WhatsApp POV in parallel
          const [linkedinPost, povPost] = await Promise.all([
            generateContent(LINKEDIN_POST_SYSTEM, context, 600),
            generateContent(POV_SYSTEM, context, 300),
          ])

          // Save to content_items
          const db = createServerClient()
          const { data: saved } = await db.from("content_items").insert({
            title: `Trust Economy Brief: ${headline}`,
            platform: "Newsletter",
            category: "Trust Economy",
            status: "Draft",
            content: fullNewsletterText,
            raw_inputs: { headline, storyBody: storyBody.slice(0, 500), source: "trust-brief" },
            metadata: { linkedinTeaser: linkedinPost, povPost, series: "trust-economy-brief" },
          }).select("id").single()

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, linkedinPost, povPost, id: saved?.id })}\n\n`))
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
