import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { generateContent } from "@/lib/claude"
import { PROMPT_TEMPLATES } from "@/lib/prompts"
import { createServerClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const { promptType, context } = await req.json()

    if (!promptType || !context?.trim()) {
      return NextResponse.json({ error: "Prompt type and context are required" }, { status: 400 })
    }

    const system = PROMPT_TEMPLATES[promptType]
    if (!system) {
      return NextResponse.json({ error: "Invalid prompt type" }, { status: 400 })
    }

    const raw = await generateContent(system, context, 2000)

    const db = createServerClient()
    const title = `${promptType.replace(/_/g, " ")} — ${context.slice(0, 50)}…`
    const { data: saved } = await db.from("content_items").insert({
      title,
      platform: "All",
      category: "Prompt",
      status: "Draft",
      content: raw,
      raw_inputs: { promptType, context },
    }).select("id").single()

    return NextResponse.json({ id: saved?.id, result: raw })
  } catch (e) {
    console.error("[prompt]", e)
    if (e instanceof Anthropic.APIError) {
      if (e.status === 529) return NextResponse.json({ error: "Claude is overloaded. Please retry in 30 seconds." }, { status: 503 })
      if (e.status === 429) return NextResponse.json({ error: "Rate limit reached. Please wait a moment." }, { status: 429 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
