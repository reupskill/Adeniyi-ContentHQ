import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { createServerClient } from "@/lib/supabase/server"

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

export async function PATCH(req: Request, { params }: { params: { date: string } }) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const body = await req.json()
    const db = createServerClient()

    const updates: Record<string, unknown> = {}
    if (body.topic !== undefined) updates.topic = body.topic
    if (body.hook !== undefined) updates.hook = body.hook
    if (body.mainMessage !== undefined) updates.main_message = body.mainMessage
    if (body.bestPlatform !== undefined) updates.best_platform = body.bestPlatform
    if (body.repurposeRecommendation !== undefined) updates.repurpose_recommendation = body.repurposeRecommendation
    if (body.cta !== undefined) updates.cta = body.cta
    if (body.contentItemId !== undefined) updates.content_item_id = body.contentItemId
    if (body.isCompleted !== undefined) updates.is_completed = body.isCompleted

    const { data, error: dbError } = await db
      .from("content_calendar")
      .update(updates)
      .eq("calendar_date", params.date)
      .select()
      .single()

    if (dbError || !data) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(mapDay(data))
  } catch (e) {
    console.error("[calendar/:date PATCH]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
