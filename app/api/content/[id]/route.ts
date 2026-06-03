export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { createServerClient } from "@/lib/supabase/server"

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

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const db = createServerClient()
    const { data, error: dbError } = await db
      .from("content_items")
      .select("*")
      .eq("id", params.id)
      .is("deleted_at", null)
      .single()

    if (dbError || !data) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(mapItem(data))
  } catch (e) {
    console.error("[content/:id GET]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const body = await req.json()
    const db = createServerClient()

    const updates: Record<string, unknown> = {}
    if (body.title !== undefined) updates.title = body.title
    if (body.status !== undefined) updates.status = body.status
    if (body.content !== undefined) updates.content = body.content
    if (body.scheduledDate !== undefined) updates.scheduled_date = body.scheduledDate
    if (body.metadata !== undefined) updates.metadata = body.metadata

    const { data, error: dbError } = await db
      .from("content_items")
      .update(updates)
      .eq("id", params.id)
      .select()
      .single()

    if (dbError || !data) return NextResponse.json({ error: "Not found or update failed" }, { status: 404 })
    return NextResponse.json(mapItem(data))
  } catch (e) {
    console.error("[content/:id PATCH]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const db = createServerClient()
    const { error: dbError } = await db
      .from("content_items")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", params.id)

    if (dbError) throw dbError
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[content/:id DELETE]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
