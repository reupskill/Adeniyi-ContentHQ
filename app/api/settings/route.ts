import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const db = createServerClient()
    const { data, error: dbError } = await db.from("app_settings").select("key, value")
    if (dbError) throw dbError

    const settings: Record<string, unknown> = {}
    for (const row of data || []) {
      settings[row.key] = row.value
    }
    return NextResponse.json(settings)
  } catch (e) {
    console.error("[settings GET]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const updates = await req.json()
    const db = createServerClient()

    const rows = Object.entries(updates).map(([key, value]) => ({ key, value }))
    const { error: dbError } = await db.from("app_settings").upsert(rows, { onConflict: "key" })
    if (dbError) throw dbError

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[settings PATCH]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
