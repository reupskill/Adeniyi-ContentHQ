export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/requireAuth"
import { createServerClient } from "@/lib/supabase/server"
import { getTrend } from "@/lib/utils"

export async function GET() {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const db = createServerClient()
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString()

    const [current, previous] = await Promise.all([
      db.from("content_items").select("platform, status, scheduled_date").is("deleted_at", null).gte("created_at", thirtyDaysAgo),
      db.from("content_items").select("platform, status").is("deleted_at", null).gte("created_at", sixtyDaysAgo).lt("created_at", thirtyDaysAgo),
    ])

    const [totalCount] = await Promise.all([
      db.from("content_items").select("id", { count: "exact", head: true }).is("deleted_at", null),
    ])

    const cur = current.data || []
    const prev = previous.data || []

    const countCur = (fn: (item: Record<string, string | null>) => boolean) =>
      cur.filter(fn).length
    const countPrev = (fn: (item: Record<string, string | null>) => boolean) =>
      prev.filter(fn).length

    const ideasCur = cur.length
    const ideasPrev = prev.length
    const scriptsCur = countCur((i) => i.platform === "Video" && i.status === "Ready to Record")
    const scriptsPrev = countPrev((i) => i.platform === "Video" && i.status === "Ready to Record")
    const repurpCur = countCur((i) => i.platform !== "Video" && i.platform !== "All")
    const repurpPrev = countPrev((i) => i.platform !== "Video" && i.platform !== "All")
    const schedCur = countCur((i) => !!i.scheduled_date)
    const schedPrev = 0

    return NextResponse.json({
      ideasGenerated: { count: ideasCur, trend: getTrend(ideasCur, ideasPrev) },
      scriptsReady: { count: scriptsCur, trend: getTrend(scriptsCur, scriptsPrev) },
      repurposedPosts: { count: repurpCur, trend: getTrend(repurpCur, repurpPrev) },
      contentScheduled: { count: schedCur, trend: getTrend(schedCur, schedPrev) },
      contentBankItems: { count: totalCount.count || 0, trend: getTrend(ideasCur, ideasPrev) },
    })
  } catch (e) {
    console.error("[dashboard/stats]", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
