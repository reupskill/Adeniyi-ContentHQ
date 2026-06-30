export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const { searchParams } = new URL(req.url)
    const platform = searchParams.get("platform")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    const db = createServerClient()
    let query = db
      .from("content_items")
      .select("*", { count: "exact" })
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (platform) query = query.eq("platform", platform)
    if (status) query = query.eq("status", status)
    if (search) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)

    const { data, count, error: dbError } = await query
    if (dbError) throw dbError

    const items = (data || []).map(mapItem)
    return NextResponse.json({ items, total: count || 0, hasMore: (count || 0) > offset + limit })
  } catch (e) {
    console.error("[content GET]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const { searchParams } = new URL(req.url)
    if (searchParams.get("confirm") !== "all") {
      return NextResponse.json({ error: "Pass ?confirm=all to bulk delete" }, { status: 400 })
    }

    const db = createServerClient()
    const { error: dbError } = await db
      .from("content_items")
      .update({ deleted_at: new Date().toISOString() })
      .is("deleted_at", null)
    if (dbError) throw dbError
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[content DELETE]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const body = await req.json()
    const db = createServerClient()
    const { data, error: dbError } = await db.from("content_items").insert(body).select().single()
    if (dbError) throw dbError

    return NextResponse.json(mapItem(data), { status: 201 })
  } catch (e) {
    console.error("[content POST]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function mapItem(row: Record<string, unknown>) {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    title: row.title,
    platform: row.platform,
    category: row.category,
    status: row.status,
    content: row.content,
    rawInputs: row.raw_inputs,
    metadata: row.metadata,
    scoreOverall: row.score_overall,
    scoreHook: row.score_hook,
    scoreClarity: row.score_clarity,
    scoreDepth: row.score_depth,
    scoreEmotionalImpact: row.score_emotional_impact,
    scoreCta: row.score_cta,
    scoreTip: row.score_tip,
    scheduledDate: row.scheduled_date,
    publishedAt: row.published_at,
  }
}
