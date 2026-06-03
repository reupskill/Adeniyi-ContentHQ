export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get("days") || "30")
    const platform = searchParams.get("platform")

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const db = createServerClient()
    let query = db.from("performance_snapshots").select("*").gte("snapshot_date", since).order("snapshot_date", { ascending: false })
    if (platform) query = query.eq("platform", platform)

    const { data, error: dbError } = await query
    if (dbError) throw dbError

    return NextResponse.json(data || [])
  } catch (e) {
    console.error("[performance GET]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const body = await req.json()
    const db = createServerClient()
    const { data, error: dbError } = await db.from("performance_snapshots").insert(body).select().single()
    if (dbError) throw dbError
    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    console.error("[performance POST]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
