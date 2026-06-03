"use client"
import Link from "next/link"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { ProgressBar, CircularScore } from "@/components/ui"

// ── Stat card with sparkline ──────────────────────────────────
const STAT_META = [
  { key: "ideasGenerated", label: "Ideas Generated", color: "var(--video)", bg: "var(--video-bg)", icon: "lightbulb" },
  { key: "scriptsReady", label: "Scripts Ready", color: "var(--linkedin)", bg: "var(--linkedin-bg)", icon: "doc" },
  { key: "repurposedPosts", label: "Repurposed Posts", color: "var(--ready)", bg: "var(--ready-bg)", icon: "recycle" },
  { key: "contentScheduled", label: "Content Scheduled", color: "var(--generating)", bg: "var(--generating-bg)", icon: "calendar" },
  { key: "contentBankItems", label: "Content Bank Items", color: "var(--video)", bg: "var(--video-bg)", icon: "archive" },
] as const

function SparkLine({ color }: { color: string }) {
  const pts = [4, 8, 5, 12, 9, 15, 11, 18, 14, 22, 18, 20, 24, 26, 22, 30].map((y, i) => `${i * 8},${36 - y}`).join(" ")
  return (
    <svg width="100%" height="38" viewBox="0 0 120 38" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatCards() {
  const { stats, isLoading } = useDashboardStats()
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
      {STAT_META.map(({ key, label, color, bg }) => {
        const data = stats?.[key as keyof typeof stats]
        const count = isLoading ? "—" : (data?.count ?? 0)
        const trend = data?.trend ?? 0
        return (
          <div key={key} className="rounded-2xl p-4 flex flex-col gap-2.5 transition-all hover:-translate-y-0.5 cursor-default"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[11px] flex-shrink-0 grid place-items-center" style={{ background: bg }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M12 20h9M12 4v16M8 8H4M8 12H4M8 16H4"/></svg>
              </div>
              <span className="text-[12.5px] font-medium" style={{ color: "var(--text-2)" }}>{label}</span>
            </div>
            <div className="font-serif text-[30px] leading-none" style={{ color: "var(--text)" }}>{count}</div>
            <div className="text-[11.5px] flex items-center gap-1.5" style={{ color: "var(--text-3)" }}>
              {trend > 0 && <span className="font-semibold flex items-center gap-0.5" style={{ color: "var(--ready)" }}>↑ {trend}%</span>}
              {trend < 0 && <span className="font-semibold" style={{ color: "var(--danger)" }}>↓ {Math.abs(trend)}%</span>}
              vs last 30 days
            </div>
            <SparkLine color={color} />
          </div>
        )
      })}
    </div>
  )
}

// ── Repurposing Pipeline ──────────────────────────────────────
const PIPELINE = [
  { label: "LinkedIn Post", href: "/linkedin", color: "var(--linkedin)", status: "Ready", note: "Scheduled 9:00 AM" },
  { label: "X / Twitter Thread", href: "/twitter", color: "var(--x)", status: "Generating", progress: 60 },
  { label: "Substack Post", href: "/substack", color: "var(--substack)", status: "Draft", note: "Edit to continue" },
  { label: "YouTube Description", href: "/video", color: "var(--youtube)", status: "Ready", note: "Optimized" },
]
const STATUS_COLORS: Record<string, string> = { Ready: "var(--ready)", Generating: "var(--generating)", Draft: "var(--draft)" }

function RepurposingPipeline() {
  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>Repurposing Pipeline</span>
        <Link href="/bank" className="text-[12.5px] font-medium no-underline hover:underline" style={{ color: "var(--gold)" }}>View pipeline</Link>
      </div>
      <div className="flex flex-col gap-2.5">
        {PIPELINE.map((p) => (
          <Link key={p.href} href={p.href}
            className="flex items-center gap-3 p-2.5 rounded-[11px] no-underline transition-all hover:translate-x-0.5 group"
            style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold-line)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}>
            <div className="w-6 h-6 rounded-md grid place-items-center flex-shrink-0" style={{ background: p.color + "22" }}>
              <span className="text-[11px] font-bold" style={{ color: p.color }}>{p.label[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{p.label}</div>
              <div className="text-[11.5px] truncate" style={{ color: "var(--text-3)" }}>The Quiet Edge: Thinking Deeply…</div>
            </div>
            <div className="text-right flex-shrink-0 min-w-[96px]">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: STATUS_COLORS[p.status], background: STATUS_COLORS[p.status] + "22" }}>
                {p.status}
              </span>
              {p.status === "Generating" && p.progress && (
                <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)", width: 84 }}>
                  <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: "var(--generating)" }} />
                </div>
              )}
              {p.note && <div className="text-[10.5px] mt-1" style={{ color: "var(--text-faint)" }}>{p.note}</div>}
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2" className="flex-shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ── Mini Calendar ─────────────────────────────────────────────
const CAL_DOTS: Record<number, string[]> = {
  1: ["var(--linkedin)"], 2: ["var(--video)", "var(--x)"],
  5: ["var(--substack)"], 6: ["var(--linkedin)", "var(--x)"],
  8: ["var(--video)"], 9: ["var(--x)"], 13: ["var(--linkedin)"],
  14: ["var(--video)"], 17: ["var(--linkedin)", "var(--substack)"],
  20: ["var(--video)"], 22: ["var(--x)"], 23: ["var(--substack)"],
  26: ["var(--video)", "var(--linkedin)"], 28: ["var(--x)"],
}
const TODAY = 17

function MiniCalendar() {
  const days = ["M", "T", "W", "T", "F", "S", "S"]
  const cells = [null, null, null, 1, 2, 3, 4, ...Array.from({ length: 27 }, (_, i) => i + 5)]
  return (
    <div>
      <div className="grid gap-0" style={{ gridTemplateColumns: "repeat(7,1fr)" }}>
        {days.map((d, i) => <div key={i} className="text-center text-[10px] font-semibold py-1" style={{ color: "var(--text-faint)", letterSpacing: "0.06em" }}>{d}</div>)}
        {cells.map((day, i) => {
          const dots = day ? (CAL_DOTS[day] ?? []) : []
          const isToday = day === TODAY
          return (
            <div key={i} className="flex flex-col items-center py-1 gap-0.5">
              <span className="text-[12px] w-6 h-6 flex items-center justify-center rounded-full"
                style={{
                  color: day ? (isToday ? "#1a140a" : "var(--text-2)") : "transparent",
                  background: isToday ? "var(--gold)" : "transparent",
                  fontWeight: isToday ? 700 : 400,
                }}>
                {day ?? ""}
              </span>
              <div className="flex gap-0.5">
                {dots.map((c, j) => <span key={j} className="w-1 h-1 rounded-full" style={{ background: c }} />)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Analyzer Summary ──────────────────────────────────────────
const ANALYZER_METRICS = [
  { name: "Hook Strength", score: 90, color: "var(--c-green, #58c98d)" },
  { name: "Clarity", score: 85, color: "var(--c-green, #58c98d)" },
  { name: "Depth", score: 88, color: "var(--c-green, #58c98d)" },
  { name: "Emotional Impact", score: 84, color: "var(--c-teal, #46c4ac)" },
  { name: "Call to Action", score: 78, color: "var(--generating)" },
]

// ── Quick Actions ─────────────────────────────────────────────
const QUICK_ACTIONS = [
  { href: "/video", label: "Create New Script", sub: "Start from idea or blank", color: "var(--video)" },
  { href: "/video", label: "Repurpose Content", sub: "Turn one piece into many", color: "var(--ready)" },
  { href: "/linkedin", label: "Generate LinkedIn Post", sub: "From script or idea", color: "var(--linkedin)" },
  { href: "/substack", label: "Write Substack Essay", sub: "Long-form content", color: "var(--substack)" },
  { href: "/analyzer", label: "Analyze Script", sub: "Get AI feedback", color: "var(--gold)" },
]

// ── Dashboard Page ────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="px-8 py-7 max-w-[1620px] w-full mx-auto pb-16">
      {/* Welcome header */}
      <div className="flex items-start justify-between gap-5 mb-6 flex-wrap">
        <div>
          <h1 className="font-serif text-[30px]" style={{ color: "var(--text)" }}>Welcome back, Adeniyi 👋</h1>
          <p className="text-[14.5px] mt-1.5" style={{ color: "var(--text-2)" }}>Create once. Share everywhere. Build influence that compounds.</p>
        </div>
        <div className="flex items-center gap-3.5 text-[12.5px]" style={{ color: "var(--text-2)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: "var(--ready)" }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          Only authorized email can access
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-5"><StatCards /></div>

      {/* Main row */}
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: "1.15fr 1fr 1.1fr", alignItems: "start" }}>
        <RepurposingPipeline />

        {/* Calendar preview */}
        <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>30-Day Calendar Preview</span>
            <Link href="/calendar" className="text-[12.5px] font-medium no-underline hover:underline" style={{ color: "var(--gold)" }}>View calendar</Link>
          </div>
          <MiniCalendar />
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {[["Video", "var(--video)"], ["LinkedIn", "var(--linkedin)"], ["X / Twitter", "#46c4ac"], ["Substack", "var(--substack)"]].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-3)" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
        </div>

        {/* Analyzer */}
        <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>Script Analyzer Summary</span>
            <Link href="/analyzer" className="text-[12.5px] font-medium no-underline hover:underline" style={{ color: "var(--gold)" }}>View full report</Link>
          </div>
          <div className="flex gap-4">
            <div className="text-center flex-shrink-0 relative" style={{ width: 120, height: 120 }}>
              <CircularScore score={87} size={120} />
              <div className="font-serif text-[13px] mt-2" style={{ color: "#58c98d" }}>Great script!</div>
            </div>
            <div className="flex-1 pt-0.5">
              {ANALYZER_METRICS.map((m) => <ProgressBar key={m.name} name={m.name} value={m.score} color={m.color} />)}
            </div>
          </div>
          <div className="flex gap-2 mt-3 p-3 rounded-[10px]" style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-line)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" className="flex-shrink-0 mt-0.5"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
            <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--cream)" }}>
              <strong style={{ color: "var(--gold)" }}>Tip:</strong> Strong hook and narrative flow. Consider adding a personal story moment to deepen emotional impact.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl p-5" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
        <div className="text-[16px] font-semibold mb-4" style={{ color: "var(--text)" }}>Quick Actions</div>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
          {QUICK_ACTIONS.map((a) => (
            <Link key={a.href + a.label} href={a.href}
              className="flex items-center gap-3 p-3.5 rounded-xl no-underline transition-all hover:-translate-y-0.5 group"
              style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold-line)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}>
              <div className="w-9 h-9 rounded-[11px] flex-shrink-0 grid place-items-center" style={{ background: a.color + "22", color: a.color }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{a.label}</div>
                <div className="text-[11.5px]" style={{ color: "var(--text-3)" }}>{a.sub}</div>
              </div>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2" className="flex-shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
