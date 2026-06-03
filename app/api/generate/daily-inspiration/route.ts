export const dynamic = "force-dynamic"

export const maxDuration = 60

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { generateContent } from "@/lib/claude"
import { SYSTEM_PROMPTS } from "@/lib/prompts"
import { createServerClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import type { DailyInspirationOutput } from "@/types"

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const body = await req.json()
    const { recentTheme, recentEvent, frustration, mistake, belief, lesson, question, onlineDisagreement, buildingLesson, currentStruggle } = body

    const fields = [recentTheme, recentEvent, frustration, mistake, belief, lesson, question, onlineDisagreement, buildingLesson, currentStruggle]
    if (!fields.some((f) => f?.trim())) {
      return NextResponse.json({ error: "At least one field is required" }, { status: 400 })
    }

    const contextLines = [
      recentTheme && `Recent Theme: ${recentTheme}`,
      recentEvent && `Recent Event: ${recentEvent}`,
      frustration && `A Frustration: ${frustration}`,
      mistake && `A Mistake: ${mistake}`,
      belief && `A Belief: ${belief}`,
      lesson && `A Lesson: ${lesson}`,
      question && `A Question: ${question}`,
      onlineDisagreement && `Online Disagreement: ${onlineDisagreement}`,
      buildingLesson && `Lesson from Building: ${buildingLesson}`,
      currentStruggle && `Current Struggle: ${currentStruggle}`,
    ].filter(Boolean).join("\n")

    const raw = await generateContent(SYSTEM_PROMPTS.dailyInspiration, contextLines, 3000)

    let output: DailyInspirationOutput
    try {
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
      output = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: "Failed to parse Claude response. Please retry." }, { status: 500 })
    }

    const db = createServerClient()
    await db.from("daily_inspirations").insert({
      inputs: body,
      content_ideas: output.contentIdeas,
      video_hooks: output.videoHooks,
      linkedin_angles: output.linkedinAngles,
      x_post_ideas: output.xPostIdeas,
      substack_angles: output.substackAngles,
      story_prompts: output.storyPrompts,
      philosophical_connections: output.philosophicalConnections,
      business_metaphors: output.businessMetaphors,
      raw_output: raw,
    })

    return NextResponse.json(output)
  } catch (e) {
    console.error("[daily-inspiration]", e)
    if (e instanceof Anthropic.APIError) {
      if (e.status === 529) return NextResponse.json({ error: "Claude is overloaded. Please retry in 30 seconds." }, { status: 503 })
      if (e.status === 429) return NextResponse.json({ error: "Rate limit reached. Please wait a moment." }, { status: 429 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
