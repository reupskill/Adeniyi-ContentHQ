import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const items = await req.json()
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Expected an array of content items" }, { status: 400 })
    }

    const db = createServerClient()
    const rows = items.map(({ id: _id, created_at: _ca, updated_at: _ua, deleted_at: _da, ...rest }) => rest)

    const { data, error: dbError } = await db.from("content_items").insert(rows).select("id")
    if (dbError) throw dbError

    return NextResponse.json({ imported: data?.length || 0 })
  } catch (e) {
    console.error("[content/import]", e)
    return NextResponse.json({ error: "Import failed" }, { status: 500 })
  }
}
