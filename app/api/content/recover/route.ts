export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { createServerClient } from "@/lib/supabase/server"

// GET: count recoverable (soft-deleted) items
export async function GET() {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const db = createServerClient()
    const { count, error: dbError } = await db
      .from("content_items")
      .select("*", { count: "exact", head: true })
      .not("deleted_at", "is", null)

    if (dbError) throw dbError
    return NextResponse.json({ recoverable: count || 0 })
  } catch (e) {
    console.error("[content/recover GET]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST: restore all soft-deleted items
export async function POST() {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const db = createServerClient()
    const { data, error: dbError } = await db
      .from("content_items")
      .update({ deleted_at: null })
      .not("deleted_at", "is", null)
      .select("id")

    if (dbError) throw dbError
    return NextResponse.json({ restored: data?.length || 0 })
  } catch (e) {
    console.error("[content/recover POST]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
