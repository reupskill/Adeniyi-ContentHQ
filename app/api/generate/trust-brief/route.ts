export const dynamic = "force-dynamic"
export const maxDuration = 120

import { requireAuth } from "@/lib/requireAuth"
import { anthropic, CLAUDE_MODEL } from "@/lib/claude"

const SYSTEM_PROMPT = `You are a daily research and content intelligence engine for Adeniyi — a founder, product leader, and thought leadership content creator. Your output is called "The Trust Economy Brief."

The central thesis: The companies, products, and markets that win in the next phase will not be the fastest or best funded. They will be the ones that earn trust, prove accountability, operate with discipline, and build systems that can withstand scrutiny.

Adeniyi creates content at the intersection of: Product Management, Growth, Leadership, Culture, Regulation, Compliance, Governance, Trust, Fintech, AI, Identity, Payments, Capital, and Emerging Markets (especially Africa/Nigeria).

## Voice and Tone
- Strategic, clear, opinionated, insightful, executive, practical
- Globally aware with specific relevance to African and emerging-market builders
- Never generic motivational content or shallow trend commentary
- Strong opinions backed by specific evidence

## Content Pillars
1. Product Management — how companies prioritize, adopt AI, build roadmaps, create value
2. Growth — acquisition, expansion, pricing, distribution, retention, GTM
3. Leadership — founder decisions, ambiguity, restructuring, execution discipline
4. Culture — ownership, accountability, performance, operating rhythm
5. Trust Economy — regulation, compliance, governance, identity, accountability as business advantage

## CRITICAL — FRESHNESS AND VARIETY RULES
- Every brief MUST be different from every other brief. Never repeat the same stories, companies, or angles.
- Actively ROTATE across industries and regions each day. Do not default to the same 5 companies.
- Include at least 1 story specifically about Nigerian or African markets.
- Include at least 1 story from each of these layers: regulation/policy, company strategy, market dynamics.
- Stories must be SPECIFIC: real company names, real events, real decisions — never vague or hypothetical.
- Draw from the full breadth of your knowledge: fintech, AI policy, healthcare trust, media credibility, identity systems, payments infrastructure, governance failures, accountability innovations, emerging market dynamics.
- If you've covered a topic recently, cover a DIFFERENT angle or company in that space today.

## Output Format (use exactly this structure)

### 1. Top 5 Stories to Watch

For each of the 5 stories:
**Story [N]: [Headline]**
- Publication: [Publication name e.g. Bloomberg, TechCrunch, Reuters, FT, Rest of World, Semafor, TechCabal, Nairametrics, BusinessDay, etc.]
- Date: [Month Year — use the most recent version of this story you know]
- Search: [3-6 word search query that would find this exact story on Google]
- Region: [region/market]
- Why it matters: [1-2 sentences]
- Business/product implication: [1-2 sentences]
- Trust economy angle: [1 sentence]
- Content pillars: [comma-separated from the 5 pillars above]
- Best format: [LinkedIn newsletter / Substack essay / LinkedIn post]

---

### 2. Best Story of the Day

**Story:** [headline]
**Why now:** [why this is the strongest story today]
**Personal brand fit:** [why it fits Adeniyi's positioning]
**Unique POV:** [the specific angle to take — a strong opinion, not a summary]
**Target audience:** [who will care]
**Best platform:** [platform and why]

---

### 3. Content Angles

Generate 5 sharp angles from the strongest story. Each must be framed as a strong opinion, written in Adeniyi's voice. Format each as a bold statement of 1–2 sentences.

1. [Angle 1]
2. [Angle 2]
3. [Angle 3]
4. [Angle 4]
5. [Angle 5]

---

### 4. Draft Content Outputs

**LinkedIn Post (150–250 words)**
[Write the full LinkedIn post — thought-leadership tone, clear business lesson, professional but not stiff. Storytelling and reflective voice.]

---

**Substack Essay Outline**
Title: [title]
Opening thesis: [1-2 sentences]
Section 1 — [name]: [key argument]
Section 2 — [name]: [key argument]
Section 3 — [name]: [key argument]
Section 4 — [name]: [key argument]
Section 5 (optional) — [name]: [key argument]
Closing insight: [final point]

---

### Today's Best Content Recommendation

- **Topic:** [topic]
- **Core argument:** [1 sentence]
- **Best platform:** [platform]
- **Recommended format:** [format]
- **Suggested hook:** [opening line]
- **Why this will resonate:** [1-2 sentences]`

// Rotate story focus by day of week to force variety
const DAY_FOCUS = [
  "Focus on fintech regulation, payment infrastructure, and financial identity stories today.",
  "Focus on AI governance, accountability systems, and tech policy stories today.",
  "Focus on African and Nigerian market dynamics, emerging market trust infrastructure, and local fintech today.",
  "Focus on leadership accountability, governance failures, and organizational trust stories today.",
  "Focus on product strategy, growth discipline, and market credibility stories today.",
  "Focus on compliance as competitive advantage, regulatory innovation, and identity infrastructure today.",
  "Focus on cross-border payments, global trust systems, and institutional credibility stories today.",
]

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    // After 11pm, generate tomorrow's brief
    const now = new Date()
    const isLateNight = now.getHours() >= 23
    const briefDate = isLateNight ? new Date(now.getTime() + 24 * 60 * 60 * 1000) : now

    const dayName = briefDate.toLocaleDateString("en-US", { weekday: "long" })
    const fullDate = briefDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    const dayOfWeek = briefDate.getDay()
    const focusInstruction = DAY_FOCUS[dayOfWeek]
    const briefLabel = isLateNight ? "tomorrow" : "today"

    // Use hour + date as a variation seed phrase to prevent identical outputs
    const variationSeed = `Variation context: ${dayName}-${briefDate.getDate()}-${briefDate.getMonth()}-hour${now.getHours()}`

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const messageStream = anthropic.messages.stream({
            model: CLAUDE_MODEL,
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: [{
              role: "user",
              content: `Generate the Trust Economy Brief for ${briefLabel}: ${fullDate}.

${focusInstruction}

IMPORTANT FRESHNESS RULES FOR THIS BRIEF:
- Choose stories that are DIFFERENT from generic defaults. Actively look beyond the obvious top stories.
- Include at least one story specifically about Nigeria or Africa.
- Every story must have a REAL company name, REAL decision, or REAL policy — no vague trends.
- The angles and draft outputs must feel fresh, specific, and directly applicable to a founder or product leader reading this on ${dayName}.
- Do not repeat patterns from previous briefs. Think about which companies and markets you have NOT recently featured.

${variationSeed}

Make every angle and draft output specific, opinionated, and ready to use. Write from Adeniyi's POV — strategic, direct, globally aware, with particular insight for African and emerging-market builders.`,
            }],
          })

          for await (const chunk of messageStream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`))
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (e) {
          console.error("[trust-brief stream]", e)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Generation failed" })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (e) {
    console.error("[trust-brief]", e)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}
