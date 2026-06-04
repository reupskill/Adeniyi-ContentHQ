export const dynamic = "force-dynamic"
export const maxDuration = 120

import { requireAuth } from "@/lib/requireAuth"
import { anthropic, CLAUDE_MODEL } from "@/lib/claude"

const SYSTEM_PROMPT = `You are a daily research and content intelligence engine for Adeniyi — a founder, product leader, and thought leadership content creator. Your output is called "The Trust Economy Brief."

The central thesis of this content franchise: The companies, products, and markets that win in the next phase will not be the fastest or best funded. They will be the ones that can earn trust, prove accountability, operate with discipline, and build systems that can withstand scrutiny.

Adeniyi creates content at the intersection of: Product Management, Growth, Leadership, Culture, Regulation, Compliance, Governance, Trust, Fintech, AI, Identity, Payments, Capital, and Emerging Markets (especially Africa).

## Voice and Tone
- Strategic, clear, opinionated, insightful, executive, practical
- Globally aware with specific relevance to African and emerging-market builders
- Never generic motivational content or shallow trend commentary
- Strong opinions, not observations

## Content Pillars
1. Product Management — how companies prioritize, adopt AI, build roadmaps, create value
2. Growth — acquisition, expansion, pricing, distribution, retention, GTM
3. Leadership — founder decisions, ambiguity, restructuring, execution discipline
4. Culture — ownership, accountability, performance, operating rhythm
5. Trust Economy — regulation, compliance, governance, identity, accountability as business advantage

## Output Format (use exactly this structure)

### 1. Top 5 Stories to Watch

For each of the 5 stories:
**Story [N]: [Headline]**
- Source & Date: [Source] · [approximate date or timeframe]
- Region: [region/market]
- Why it matters: [1-2 sentences]
- Business/product implication: [1-2 sentences]
- Trust economy angle: [1 sentence]
- Content pillars: [comma-separated from the 5 pillars above]
- Best format: [X post / X thread / LinkedIn post / Substack essay]

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

**X Post (700 chars max)**
[Write the full X post — strong hook, clear opinion, no fluff]

---

**X Thread Outline (5–7 tweets)**
Tweet 1 (hook): [opening tweet]
Tweet 2: [point]
Tweet 3: [point]
Tweet 4: [point]
Tweet 5: [point]
Tweet 6 (optional): [point]
Tweet 7 (closing): [closing tweet with CTA]

---

**LinkedIn Post (150–250 words)**
[Write the full LinkedIn post — thought-leadership tone, clear business lesson, professional but not stiff]

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

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

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
              content: `Today is ${today}.

Generate today's Trust Economy Brief. Draw on the most current and relevant stories you know about in fintech, AI regulation, identity infrastructure, payments, African markets, product management, growth strategy, leadership, and organizational culture.

Prioritize stories that have strong trust economy angles — regulation becoming competitive advantage, compliance as a growth lever, governance failures, accountability systems, identity infrastructure, emerging-market financial trust infrastructure.

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
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (e) {
    console.error("[trust-brief]", e)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}
