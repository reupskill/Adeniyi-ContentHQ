export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { createServerClient } from "@/lib/supabase/server"

const TOPIC_LIBRARY = [
  { category: "Philosophy", topic: "The gap between knowing and doing", platform: "LinkedIn", hook: "Most people know what to do. They just don't do it.", message: "Knowledge is abundant; execution is the scarce asset.", repurpose: "Expand into a 3-tweet thread on discipline.", cta: "What's one thing you know but avoid?" },
  { category: "Founder Lesson", topic: "Why self-awareness is a competitive advantage", platform: "Video", hook: "The most underrated founder skill isn't vision. It's self-awareness.", message: "Seeing yourself clearly compounds every other decision.", repurpose: "Pull the hook into a standalone X one-liner.", cta: "Audit one blind spot this week." },
  { category: "Philosophy", topic: "The 100% of nothing trap", platform: "Substack", hook: "You can own 100% of nothing, or 5% of something that matters.", message: "Control is seductive; leverage is what builds influence.", repurpose: "Trim into a LinkedIn post on letting go.", cta: "Where are you over-owning?" },
  { category: "Focus", topic: "Depth as an unfair advantage", platform: "LinkedIn", hook: "In a world of fast takes, slow thinking is a moat.", message: "Depth compounds; noise decays.", repurpose: "Convert to a founder-lesson thread.", cta: "Read one hard thing this week." },
  { category: "Mindset", topic: "The cost of the unexamined strategy", platform: "Video", hook: "A roadmap without reflection is just confident guessing.", message: "Examine the strategy before you scale it.", repurpose: "Repurpose into a Substack essay.", cta: "Question one assumption today." },
  { category: "Leadership", topic: "Skin in the game and honest content", platform: "X", hook: "Advice without risk is entertainment.", message: "Create from things you actually staked something on.", repurpose: "Expand into a LinkedIn carousel.", cta: "Share one thing you risked." },
  { category: "Building", topic: "Why clarity beats confidence", platform: "Video", hook: "Confidence without clarity is just noise at volume.", message: "Founders who know exactly why they're building make better decisions.", repurpose: "Turn into a 3-tweet thread.", cta: "Write down why you're building — in one sentence." },
  { category: "Mindset", topic: "The compound effect of consistent thinking", platform: "LinkedIn", hook: "One clear thought daily beats ten scattered ideas weekly.", message: "Thinking is a skill. Practice it like one.", repurpose: "Expand into a Substack reflection.", cta: "What did you think deeply about today?" },
  { category: "Discipline", topic: "Optionality is the enemy of commitment", platform: "X", hook: "Keeping all your options open means fully committing to none.", message: "Decisions compound; indecision erodes.", repurpose: "Turn into a founder-lesson LinkedIn post.", cta: "What's one decision you've been avoiding?" },
  { category: "Growth", topic: "The quiet work behind visible success", platform: "LinkedIn", hook: "What you see on stage was built backstage.", message: "Most of the real work happens in private.", repurpose: "Expand into a video script.", cta: "What are you building quietly right now?" },
  { category: "Philosophy", topic: "Learning from the things that didn't work", platform: "Substack", hook: "My biggest lessons came from things I shipped that flopped.", message: "Failure is data. Use it like a founder.", repurpose: "Turn key insights into a Twitter thread.", cta: "What has a recent failure taught you?" },
  { category: "Leadership", topic: "The art of asking better questions", platform: "Video", hook: "The quality of your life is determined by the quality of your questions.", message: "Questions cut through noise. Answers often just add to it.", repurpose: "Repurpose as a LinkedIn post about strategy.", cta: "What question are you not asking?" },
  { category: "Focus", topic: "Saying no as a business strategy", platform: "X", hook: "Every yes to the wrong thing is a no to the right one.", message: "Clarity about what not to do is as valuable as knowing what to do.", repurpose: "Expand into a founder-led LinkedIn post.", cta: "What do you need to say no to?" },
  { category: "Founder Lesson", topic: "Building for one person first", platform: "LinkedIn", hook: "The worst products try to please everyone. The best serve one person obsessively.", message: "Niche depth beats broad shallow reach.", repurpose: "Turn into a video script about focus.", cta: "Who is your one person?" },
  { category: "Mindset", topic: "Slowing down to go fast", platform: "Video", hook: "Speed without direction is just expensive movement.", message: "The founders who pause to think often outpace those who never stop.", repurpose: "Condense into a LinkedIn reflection.", cta: "When did slowing down actually speed you up?" },
  { category: "Philosophy", topic: "The tyranny of the urgent vs. the important", platform: "Substack", hook: "Most people spend their lives responding, not building.", message: "What's urgent is rarely important. What's important is rarely urgent.", repurpose: "Turn key insight into an X thread.", cta: "What important thing have you been postponing?" },
  { category: "Building", topic: "Why distribution matters more than product", platform: "LinkedIn", hook: "A great product no one can find is just an expensive hobby.", message: "Distribution is the leverage most builders undervalue.", repurpose: "Expand into a video script about building.", cta: "How does your audience find you?" },
  { category: "Growth", topic: "The compounding power of written thinking", platform: "X", hook: "Writing forces clarity. Clarity forces better decisions.", message: "Founders who write think better. Not because writing is magic — but because it externalizes the mess.", repurpose: "Expand into a LinkedIn post about clarity.", cta: "Write one clear thought today." },
  { category: "Discipline", topic: "Consistency beats intensity", platform: "Video", hook: "One hour daily beats ten hours monthly. Every time.", message: "Sustainable rhythm compounds. Sprints exhaust and fade.", repurpose: "Turn into a LinkedIn post on building habits.", cta: "What can you do for one hour, every day?" },
  { category: "Mindset", topic: "What your calendar reveals about your priorities", platform: "LinkedIn", hook: "You can say anything about your priorities. Your calendar doesn't lie.", message: "Time allocation is the truest map of values.", repurpose: "Turn into a reflective X thread.", cta: "Look at your calendar. Does it match what you say matters?" },
  { category: "Founder Lesson", topic: "Solving the problem vs. solving your version of it", platform: "Video", hook: "The most dangerous startup trap: building the product you wish existed, not the one people need.", message: "Empathy over assumptions. Always.", repurpose: "Repurpose as a Substack essay on product intuition.", cta: "When did you last talk to a user?" },
  { category: "Philosophy", topic: "Emotional intelligence as a founder advantage", platform: "Substack", hook: "The greatest leadership lever isn't strategy. It's emotional intelligence.", message: "You can't lead others well until you understand yourself.", repurpose: "Condense into a LinkedIn post on leadership.", cta: "What emotion is currently running your decisions?" },
  { category: "Leadership", topic: "Trust as the infrastructure of teams", platform: "LinkedIn", hook: "You can't build a great team without first building trust.", message: "Trust isn't given; it's accumulated through consistent small actions.", repurpose: "Expand into a video on team-building.", cta: "What are you doing today to build trust?" },
  { category: "Focus", topic: "The liberation of constraint", platform: "X", hook: "Unlimited options paralyze. Constraints create.", message: "Some of the best work comes from working within limits.", repurpose: "Expand into a LinkedIn post about creativity.", cta: "What constraint could you embrace today?" },
  { category: "Growth", topic: "Audience first, product second", platform: "Video", hook: "The best founders build their audience before they build their product.", message: "Distribution-first thinking changes everything about how you build.", repurpose: "Turn into a LinkedIn post about content strategy.", cta: "Who are you building an audience with right now?" },
  { category: "Discipline", topic: "The power of the pre-decision", platform: "LinkedIn", hook: "Make the decision before you're in the moment, and the moment gets easier.", message: "Willpower is finite; systems are infinite.", repurpose: "Turn into a short X thread on decision-making.", cta: "What decisions can you pre-commit to today?" },
  { category: "Building", topic: "Why your users' words are your best copy", platform: "Substack", hook: "The most effective marketing language was written by your customers, not your agency.", message: "Listen with the intent to borrow their language.", repurpose: "Turn into a LinkedIn post about product language.", cta: "Quote a real user today." },
  { category: "Philosophy", topic: "The patient founder wins", platform: "Video", hook: "Most founders overestimate what they can build in a year and underestimate what they can build in a decade.", message: "Patience is a competitive advantage disguised as boredom.", repurpose: "Condense into an X founder-lesson post.", cta: "What are you playing the long game on?" },
  { category: "Mindset", topic: "Building confidence from evidence, not affirmation", platform: "LinkedIn", hook: "Confidence built on affirmation is fragile. Confidence built on evidence compounds.", message: "Do the work. Let the record speak.", repurpose: "Turn into a video on self-trust.", cta: "What evidence of your competence do you have?" },
  { category: "Founder Lesson", topic: "The danger of stealth mode thinking", platform: "X", hook: "Stealth mode protects your ego, not your idea.", message: "Sharing publicly builds accountability, distribution, and feedback.", repurpose: "Expand into a LinkedIn post on building in public.", cta: "What can you share this week that you've been holding back?" },
]

function mapDay(row: Record<string, unknown>) {
  return {
    id: row.id,
    calendarDate: row.calendar_date,
    dayNumber: row.day_number,
    category: row.category,
    topic: row.topic,
    hook: row.hook,
    mainMessage: row.main_message,
    bestPlatform: row.best_platform,
    repurposeRecommendation: row.repurpose_recommendation,
    cta: row.cta,
    contentItemId: row.content_item_id,
    isCompleted: row.is_completed,
  }
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr]
  let s = seed
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    const j = Math.abs(s) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const { month } = await req.json()
    const targetMonth = month || new Date().toISOString().slice(0, 7)
    const [year, monthNum] = targetMonth.split("-").map(Number)
    const daysInMonth = new Date(year, monthNum, 0).getDate()

    // Seed shuffle by year+month so each month has a unique but reproducible order
    const seed = year * 100 + monthNum
    const shuffled = seededShuffle(TOPIC_LIBRARY, seed)

    const rows = []
    for (let day = 1; day <= 30 && day <= daysInMonth; day++) {
      const topic = shuffled[(day - 1) % shuffled.length]
      const dateStr = `${targetMonth}-${String(day).padStart(2, "0")}`
      rows.push({
        calendar_date: dateStr,
        day_number: day,
        category: topic.category,
        topic: topic.topic,
        hook: topic.hook,
        main_message: topic.message,
        best_platform: topic.platform,
        repurpose_recommendation: topic.repurpose,
        cta: topic.cta,
      })
    }

    const db = createServerClient()

    // Upsert calendar rows
    const { data: calData, error: dbError } = await db
      .from("content_calendar")
      .upsert(rows, { onConflict: "calendar_date" })
      .select()

    if (dbError) throw dbError

    // Auto-save ideas that don't yet have a linked content item
    const calRows = calData || []
    const unlinked = calRows.filter((r) => !r.content_item_id)
    if (unlinked.length > 0) {
      const contentItems = unlinked.map((r) => ({
        title: r.topic,
        platform: r.best_platform,
        category: r.category,
        status: "Idea",
        content: [r.hook, r.main_message, r.repurpose_recommendation, r.cta].filter(Boolean).join("\n\n"),
        raw_inputs: { calendar_date: r.calendar_date, hook: r.hook, main_message: r.main_message, cta: r.cta },
      }))

      const { data: savedItems, error: itemsError } = await db
        .from("content_items")
        .insert(contentItems)
        .select("id, title")

      if (!itemsError && savedItems) {
        // Link each calendar row to its new content item
        await Promise.all(
          unlinked.map((r, i) =>
            db.from("content_calendar")
              .update({ content_item_id: savedItems[i]?.id })
              .eq("id", r.id)
          )
        )
        // Patch the returned data so content_item_id is populated
        savedItems.forEach((item, i) => {
          if (unlinked[i]) unlinked[i].content_item_id = item.id
        })
      }
    }

    return NextResponse.json(calRows.map(mapDay))
  } catch (e) {
    console.error("[calendar/generate]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
