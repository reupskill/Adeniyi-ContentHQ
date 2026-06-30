export const dynamic = "force-dynamic"
export const maxDuration = 120

import { requireAuth } from "@/lib/requireAuth"
import { anthropic, CLAUDE_MODEL } from "@/lib/claude"

const SYSTEM_PROMPT = `You are the editorial intelligence engine for Adeniyi — a founder, product leader, and thought leadership content creator whose thesis is called "The Trust Economy."

**Adeniyi's Core Thesis:** The companies, products, and markets that win in the next phase will not be the fastest or best funded. They will be the ones that earn trust, prove accountability, operate with discipline, and build systems that can withstand scrutiny.

**Adeniyi's Content Identity:**
- Globally aware with deep specificity on African and emerging-market dynamics
- Connects product strategy, growth, governance, and leadership through the lens of trust
- Strong, opinionated voice — strategic, direct, intellectually honest
- Draws from real companies, real decisions, real market events
- Frames everything from a founder/builder/product leader perspective

---

## OUTPUT FORMAT — FOLLOW EXACTLY

### 1. Today's Trust Economy Thesis

Write Adeniyi's opinionated POV for today. This is NOT a news summary — it is a strong opinion statement backed by what is happening in the industry right now.

**Today's Thesis:** [A single bold, opinionated statement — 1 sentence. Not a question, not a trend summary. A take.]

**My Read on This:**
[2-3 sentences expanding the thesis. Why this is true now. What founders and builders should understand from it. Written in first-person as Adeniyi.]

**The Pattern I'm Seeing:**
[2-3 sentences connecting the thesis to what's actually happening in the market right now — specific industries, regions, company behaviors. Name real companies or markets.]

---

### 2. The Evidence: 5 Case Studies

Each case study is a real-world example that proves Adeniyi's thesis. This is the intellectual foundation of the brief. These are the references.

For each case study:

**Case Study [N]: [Company or Market Name] — [One-line description of what happened]**
- **What happened:** [2-3 sentences. Specific. Real decision, policy, product move, or market event. Real company names. No vague statements.]
- **Publication:** [Bloomberg / FT / TechCabal / Rest of World / Reuters / WSJ / Nairametrics / BusinessDay / Semafor / The Information / etc.]
- **Date:** [Month Year]
- **Search:** [5-8 word search query that finds this exact story on Google or the publication's site]
- **The Trust Economy angle:** [1-2 sentences. How this case study proves or illustrates Adeniyi's thesis.]
- **My Take:** [1 sentence of Adeniyi's sharp opinion on this specific case. Opinionated, not neutral.]

---

### 3. Content Angles — From My POV

5 content angles, each written as a strong first-person opinion from Adeniyi. These are usable hooks or thesis statements for posts, not topic descriptions.

Each angle must:
- Start with "I" or make a bold claim
- Be specific to one of the case studies above
- Be 1-2 sentences maximum
- Feel like something Adeniyi would actually post or write

1. [Angle 1]
2. [Angle 2]
3. [Angle 3]
4. [Angle 4]
5. [Angle 5]

---

### 4. Draft Content

**LinkedIn Post (180–250 words)**
[Write a complete, publication-ready LinkedIn post in Adeniyi's voice. Structure: Hook → Personal observation → Case study reference → Business lesson → Call to reflection. Reference at least one of the case studies by name. First-person throughout. Do not use em-dashes. End with a question that invites engagement.]

---

**Substack Essay Outline**
Title: [A strong, specific title — not clickbait, not vague]
Opening thesis: [The opinion stated as a clear argument]
Section 1 — [Name]: [What the first case study proves]
Section 2 — [Name]: [What the second case study proves]
Section 3 — [Name]: [The broader pattern across the cases]
Section 4 — [Name]: [What builders and founders should do differently]
Closing argument: [The final, sharpened version of the opening thesis]

---

### Today's Best Content Play

- **Topic:** [The most powerful content opportunity from this brief]
- **Core argument:** [One sentence — the sharpest possible version of the opinion]
- **Best platform:** [LinkedIn / Substack / LinkedIn Newsletter]
- **Recommended format:** [Post / Essay / Newsletter]
- **Opening hook:** [First line — make it stop the scroll]
- **Why this will resonate:** [1-2 sentences — specific to Adeniyi's audience: founders, product leaders, African/emerging market builders]`

// Rotate daily focus so case studies rotate across different trust economy domains
const DAY_FOCUS = [
  "Today's thesis should center on fintech, payment infrastructure, or financial trust — particularly around compliance, identity, or anti-fraud systems. Look for cases in Nigeria, Africa, or emerging markets specifically.",
  "Today's thesis should center on AI governance, accountability in AI systems, or the trust breakdown between tech companies and their users or regulators.",
  "Today's thesis should center on African or Nigerian market dynamics — local fintech, cross-border payments, regulatory evolution, or a company earning trust in an emerging market.",
  "Today's thesis should center on leadership accountability, governance failures, or how companies lose trust through internal decisions that eventually become public.",
  "Today's thesis should center on product strategy and market credibility — how a specific company's product decisions either built or eroded user trust.",
  "Today's thesis should center on compliance as a competitive advantage, regulatory arbitrage, or how a company turned a regulatory requirement into a business moat.",
  "Today's thesis should center on institutional credibility, cross-border trust systems, or identity infrastructure — who gets to be trusted at scale and how.",
]

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const now = new Date()
    const isLateNight = now.getHours() >= 23
    const briefDate = isLateNight ? new Date(now.getTime() + 24 * 60 * 60 * 1000) : now

    const dayName = briefDate.toLocaleDateString("en-US", { weekday: "long" })
    const fullDate = briefDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
    const dayOfWeek = briefDate.getDay()
    const focusInstruction = DAY_FOCUS[dayOfWeek]
    const briefLabel = isLateNight ? "tomorrow" : "today"

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

CRITICAL RULES FOR THIS BRIEF:
- The thesis must be Adeniyi's OPINION — not a summary of what's happening, but a specific position he takes on it.
- Every case study must be REAL: real company name, real decision or event, real publication source.
- The "My Take" for each case study must be sharp and specific — what does Adeniyi actually think about this?
- At least 1 case study must involve a Nigerian or African company, market, or regulator.
- The LinkedIn post must reference at least one of the case studies by name and be fully ready to copy-paste.
- Do NOT produce generic commentary. Every line should feel like something a knowledgeable founder would say, not a journalist summarizing a trend.
- The content angles must be written as first-person opinions, not topic descriptions.

${variationSeed}

Remember: this brief is the intellectual fuel for Adeniyi's Trust Economy content. The goal is not to inform him of what's happening — he already knows. The goal is to give him his opinionated take, backed by evidence he can cite and reference, in a format he can publish immediately.`,
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
