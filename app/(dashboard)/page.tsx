"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDashboardStats } from "@/hooks/useDashboardStats"

// ── Stat cards ────────────────────────────────────────────────
const STAT_META = [
  { key: "ideasGenerated",   label: "Ideas Generated",    color: "var(--video)",      bg: "var(--video-bg)" },
  { key: "scriptsReady",     label: "Scripts Ready",      color: "var(--linkedin)",   bg: "var(--linkedin-bg)" },
  { key: "repurposedPosts",  label: "Repurposed Posts",   color: "var(--ready)",      bg: "var(--ready-bg)" },
  { key: "contentScheduled", label: "Content Scheduled",  color: "var(--generating)", bg: "var(--generating-bg)" },
  { key: "contentBankItems", label: "Total in Bank",      color: "var(--video)",      bg: "var(--video-bg)" },
] as const

function StatCards() {
  const { stats, isLoading } = useDashboardStats()
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
      {STAT_META.map(({ key, label, color, bg }) => {
        const data = stats?.[key as keyof typeof stats]
        const count = isLoading ? "—" : (data?.count ?? 0)
        const trend = data?.trend ?? 0
        return (
          <div key={key} className="rounded-2xl p-4 flex flex-col gap-2"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[11px] flex-shrink-0 grid place-items-center" style={{ background: bg }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                  <path d="M12 20h9M12 4v16M8 8H4M8 12H4M8 16H4"/>
                </svg>
              </div>
              <span className="text-[12.5px] font-medium" style={{ color: "var(--text-2)" }}>{label}</span>
            </div>
            <div className="font-serif text-[32px] leading-none" style={{ color: "var(--text)" }}>{count}</div>
            <div className="text-[11.5px] flex items-center gap-1.5" style={{ color: "var(--text-3)" }}>
              {trend > 0 && <span className="font-semibold" style={{ color: "var(--ready)" }}>↑ {trend}%</span>}
              {trend < 0 && <span className="font-semibold" style={{ color: "var(--danger)" }}>↓ {Math.abs(trend)}%</span>}
              <span>vs last 30 days</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Recent content ────────────────────────────────────────────
const PLATFORM_COLORS: Record<string, string> = {
  Video: "var(--video)",
  LinkedIn: "var(--linkedin)",
  X: "var(--text-2)",
  Substack: "var(--substack)",
  Newsletter: "var(--gold)",
  All: "var(--text-3)",
}

const STATUS_COLORS: Record<string, string> = {
  Idea: "var(--text-3)",
  Draft: "var(--generating)",
  "Ready to Record": "var(--ready)",
  Published: "var(--published, var(--ready))",
}

interface PipelineItem {
  id: string
  title: string
  platform: string
  status: string
  createdAt: string
}

function RecentContent() {
  const [items, setItems] = useState<PipelineItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard/pipeline")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>Recent Content</span>
        <Link href="/bank" className="text-[12.5px] font-medium no-underline hover:underline" style={{ color: "var(--gold)" }}>View all</Link>
      </div>

      {loading ? (
        <div className="text-center py-8 text-[13px]" style={{ color: "var(--text-3)" }}>Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[13px] mb-3" style={{ color: "var(--text-3)" }}>No content yet. Generate your first piece to see it here.</p>
          <Link href="/video" className="text-[12.5px] font-semibold no-underline" style={{ color: "var(--gold)" }}>Start generating →</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => {
            const color = PLATFORM_COLORS[item.platform] || "var(--text-3)"
            const statusColor = STATUS_COLORS[item.status] || "var(--text-3)"
            const date = new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            return (
              <Link key={item.id} href={`/bank?id=${item.id}`}
                className="flex items-center gap-3 p-2.5 rounded-[10px] no-underline transition-all group"
                style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold-line)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--text)" }}>{item.title}</p>
                  <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{item.platform}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ color: statusColor, background: statusColor + "22" }}>{item.status}</span>
                  <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>{date}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Content Log (chronological activity) ─────────────────────
function ContentLog() {
  const [items, setItems] = useState<PipelineItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard/pipeline")
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const grouped: Record<string, PipelineItem[]> = {}
  for (const item of items) {
    const day = new Date(item.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    if (!grouped[day]) grouped[day] = []
    grouped[day].push(item)
  }

  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>Content Log</span>
        <Link href="/bank" className="text-[12.5px] font-medium no-underline hover:underline" style={{ color: "var(--gold)" }}>Full log</Link>
      </div>

      {loading ? (
        <div className="text-center py-8 text-[13px]" style={{ color: "var(--text-3)" }}>Loading…</div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-8 text-[13px]" style={{ color: "var(--text-3)" }}>No activity yet</div>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(grouped).map(([day, dayItems]) => (
            <div key={day}>
              <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase mb-2" style={{ color: "var(--text-faint)" }}>{day}</div>
              <div className="flex flex-col gap-1.5">
                {dayItems.map((item) => {
                  const color = PLATFORM_COLORS[item.platform] || "var(--text-3)"
                  return (
                    <div key={item.id} className="flex items-center gap-2.5 py-1">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                      <p className="text-[12.5px] truncate flex-1" style={{ color: "var(--text-2)" }}>{item.title}</p>
                      <span className="text-[11px] flex-shrink-0" style={{ color: "var(--text-faint)" }}>{item.platform}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Quick Actions ─────────────────────────────────────────────
const QUICK_ACTIONS = [
  { href: "/video",    label: "Video Script",      sub: "45-60 second script",       color: "var(--video)" },
  { href: "/linkedin", label: "LinkedIn Post",      sub: "Reflective, personal",      color: "var(--linkedin)" },
  { href: "/twitter",  label: "X / Twitter",        sub: "Threads and one-liners",    color: "var(--text-2)" },
  { href: "/substack", label: "Substack Essay",     sub: "Long-form thinking",        color: "var(--substack)" },
  { href: "/daily",    label: "Content River",      sub: "Ideas from existing writing", color: "var(--gold)" },
  { href: "/ai-brief", label: "Daily Brief",        sub: "With Adeniyi Babajide",     color: "var(--video)" },
  { href: "/training", label: "Training Examples",  sub: "Teach the AI your voice",   color: "var(--gold)" },
  { href: "/calendar", label: "Content Calendar",   sub: "30-day plan",               color: "var(--generating)" },
]

// ── Dashboard ─────────────────────────────────────────────────
export default function DashboardPage() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  return (
    <div className="px-8 py-7 max-w-[1620px] w-full mx-auto pb-16">
      <div className="flex items-start justify-between gap-5 mb-6 flex-wrap">
        <div>
          <h1 className="font-serif text-[30px]" style={{ color: "var(--text)" }}>Welcome back, Adeniyi</h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--text-2)" }}>{today}</p>
        </div>
        <div className="flex items-center gap-3.5 text-[12.5px]" style={{ color: "var(--text-2)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: "var(--ready)" }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          Private workspace
        </div>
      </div>

      <div className="mb-5"><StatCards /></div>

      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: "1.3fr 1fr", alignItems: "start" }}>
        <RecentContent />
        <ContentLog />
      </div>

      <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
        <div className="text-[16px] font-semibold mb-4" style={{ color: "var(--text)" }}>Quick Actions</div>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.href + a.label} href={a.href}
              className="flex items-center gap-3 p-3.5 rounded-xl no-underline transition-all hover:-translate-y-0.5"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold-line)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}>
              <div className="w-9 h-9 rounded-[11px] flex-shrink-0 grid place-items-center"
                style={{ background: a.color + "22", color: a.color }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{a.label}</div>
                <div className="text-[11.5px]" style={{ color: "var(--text-3)" }}>{a.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
