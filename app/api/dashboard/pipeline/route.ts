export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const db = createServerClient()
    const { data } = await db
      .from("content_items")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(8)

    const items = (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      platform: row.platform,
      status: row.status,
      createdAt: row.created_at,
    }))

    return NextResponse.json({ items })
  } catch (e) {
    console.error("[dashboard/pipeline]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
