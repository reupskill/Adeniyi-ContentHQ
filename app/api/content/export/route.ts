import { requireAuth } from "@/lib/requireAuth"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const { error } = await requireAuth()
    if (error) return error

    const db = createServerClient()
    const { data, error: dbError } = await db
      .from("content_items")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })

    if (dbError) throw dbError

    const date = new Date().toISOString().slice(0, 10)
    const json = JSON.stringify(data, null, 2)

    return new Response(json, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="adeniyi-content-bank-${date}.json"`,
      },
    })
  } catch (e) {
    console.error("[content/export]", e)
    return new Response(JSON.stringify({ error: "Export failed" }), { status: 500 })
  }
}
