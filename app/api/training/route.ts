export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { anthropic, CLAUDE_MODEL } from "@/lib/claude"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const db = createServerClient()
    const { data, error: dbError } = await db
      .from("content_items")
      .select("id, title, platform, category, content, created_at, metadata")
      .is("deleted_at", null)
      .filter("metadata->>isTrainingExample", "eq", "true")
      .order("created_at", { ascending: false })
      .limit(50)

    if (dbError) throw dbError
    return NextResponse.json({ items: data || [] })
  } catch (e) {
    console.error("[training GET]", e)
    return NextResponse.json({ error: "Failed to load" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const body = await req.json()
    const { text, imageBase64, platform, notes } = body

    let content = text?.trim() || ""
    let extractedTitle = notes?.trim() || "My writing example"

    // If image provided, use Claude Vision to extract and analyse it
    if (imageBase64 && !content) {
      // Detect actual media type from the original data URL sent by client
      const rawDataUrl = body.imageDataUrl as string | undefined
      let mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif" = "image/jpeg"
      if (rawDataUrl?.startsWith("data:image/png")) mediaType = "image/png"
      else if (rawDataUrl?.startsWith("data:image/webp")) mediaType = "image/webp"
      else if (rawDataUrl?.startsWith("data:image/gif")) mediaType = "image/gif"

      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1500,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: imageBase64 },
            },
            {
              type: "text",
              text: `Extract the full text content from this screenshot of written content. Return ONLY the text as written — preserve paragraph breaks, line breaks, and formatting. Do not add commentary, labels, or your own words. If the image does not contain readable text, say "No text found."`,
            },
          ],
        }],
      })
      const extracted = response.content[0].type === "text" ? response.content[0].text : ""
      if (!extracted || extracted === "No text found.") {
        return NextResponse.json({ error: "Could not extract text from image" }, { status: 400 })
      }
      content = extracted
      extractedTitle = notes?.trim() || `Screenshot — ${platform || "Writing"} example`
    }

    if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 })

    // Map platform to default category (same values generators use)
    const PLATFORM_CATEGORY: Record<string, string> = {
      LinkedIn: "Leadership", Video: "Mindset", Substack: "Philosophy",
      X: "Leadership", Newsletter: "Leadership",
    }
    const resolvedPlatform = platform || "LinkedIn"
    const resolvedCategory = PLATFORM_CATEGORY[resolvedPlatform] || "Leadership"

    const db = createServerClient()
    const { data: saved, error: dbError } = await db
      .from("content_items")
      .insert({
        title: extractedTitle.slice(0, 120),
        platform: resolvedPlatform,
        category: resolvedCategory,
        status: "Draft",
        content,
        raw_inputs: { source: "my-writing", notes },
        metadata: { isTrainingExample: true, addedAt: new Date().toISOString() },
      })
      .select("id")
      .single()

    if (dbError) {
      console.error("[training POST] DB error:", dbError)
      return NextResponse.json({ error: dbError.message || "Database error" }, { status: 500 })
    }
    return NextResponse.json({ id: saved?.id, success: true })
  } catch (e) {
    console.error("[training POST]", e)
    const msg = e instanceof Error ? e.message : "Failed to save"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
