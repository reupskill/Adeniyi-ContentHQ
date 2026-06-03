export const dynamic = "force-dynamic"

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

export async function GET(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const { searchParams } = new URL(req.url)
    const month = searchParams.get("month") || new Date().toISOString().slice(0, 7)

    const db = createServerClient()
    const { data, error: dbError } = await db
      .from("content_calendar")
      .select("*")
      .gte("calendar_date", `${month}-01`)
      .lte("calendar_date", `${month}-31`)
      .order("calendar_date")

    if (dbError) throw dbError
    return NextResponse.json((data || []).map(mapDay))
  } catch (e) {
    console.error("[calendar GET]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
