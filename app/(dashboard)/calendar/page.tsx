"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Topbar } from "@/components/layout/Topbar"
import { Button, Card } from "@/components/ui"
import { useCalendar } from "@/hooks/useCalendar"
import { useAppStore } from "@/store/useAppStore"
import type { CalendarDay } from "@/types"

const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const PLATFORM_COLORS: Record<string, string> = {
  Video: "var(--video)", LinkedIn: "var(--linkedin)", X: "#46c4ac", Substack: "var(--substack)"
}

function buildGrid(year: number, month: number) {
  const first = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = (first === 0 ? 6 : first - 1)
  const cells: (number | null)[] = Array(offset).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7) cells.push(null)
  return cells
}

function SlideField({ label, body }: { label: string; body: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: "var(--gold)" }}>{label}</span>
      </div>
      <p className="text-[13.5px] leading-relaxed pl-0" style={{ color: "var(--text-2)" }}>{body}</p>
    </div>
  )
}

export default function CalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState<CalendarDay | null>(null)
  const { showToast } = useAppStore()
  const router = useRouter()

  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`
  const { days, isLoading, generatePlan } = useCalendar(monthStr)

  const dayMap = new Map(days.map((d) => [parseInt(d.calendarDate.split("-")[2]), d]))
  const cells = buildGrid(year, month)
  const monthName = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const prev = () => { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  const next = () => { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  const handleGenerate = async () => {
    try {
      await generatePlan()
      showToast("30-day plan generated", "ok")
    } catch (e: any) {
      showToast(e?.message || "Failed to generate plan", "error")
    }
  }

  return (
    <>
      <Topbar title="Content Calendar" sub="30-day content planning" />
      <div className="px-8 py-7 max-w-[1620px] w-full mx-auto pb-16">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button onClick={prev} className="w-9 h-9 grid place-items-center rounded-lg bg-[var(--surface-2)] border border-[var(--line-2)] cursor-pointer text-[var(--text-2)] hover:text-[var(--text)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <h1 className="font-serif text-[26px]" style={{ color: "var(--text)" }}>{monthName}</h1>
            <button onClick={next} className="w-9 h-9 grid place-items-center rounded-lg bg-[var(--surface-2)] border border-[var(--line-2)] cursor-pointer text-[var(--text-2)] hover:text-[var(--text)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              {Object.entries(PLATFORM_COLORS).map(([p, c]) => (
                <div key={p} className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-3)" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: c }} />{p}
                </div>
              ))}
            </div>
            <Button variant="primary" loading={isLoading} onClick={handleGenerate}>Generate 30-Day Plan</Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="grid border-b border-[var(--line)]" style={{ gridTemplateColumns: "repeat(7,1fr)" }}>
            {DOW.map((d) => (
              <div key={d} className="px-3.5 py-3 text-[11px] font-semibold tracking-[0.08em] uppercase" style={{ color: "var(--text-3)" }}>{d}</div>
            ))}
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(7,1fr)", gridAutoRows: "116px" }}>
            {cells.map((day, i) => {
              const calDay = day ? dayMap.get(day) : null
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              const isSelected = selected && day && parseInt(selected.calendarDate.split("-")[2]) === day
              return (
                <div key={i}
                  onClick={() => calDay && setSelected(calDay)}
                  className="p-2 overflow-hidden transition-colors"
                  style={{
                    borderRight: i % 7 !== 6 ? "1px solid var(--line)" : "none",
                    borderBottom: i < cells.length - 7 ? "1px solid var(--line)" : "none",
                    background: !day ? "rgba(0,0,0,0.18)" : isSelected ? "var(--surface-2)" : "transparent",
                    cursor: calDay ? "pointer" : "default",
                  }}
                  onMouseEnter={(e) => { if (calDay) e.currentTarget.style.background = "var(--surface-2)" }}
                  onMouseLeave={(e) => { if (calDay && !isSelected) e.currentTarget.style.background = "transparent" }}>
                  {day && (
                    <>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[13px] w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "font-bold" : "font-medium"}`}
                          style={{ color: isToday ? "#1a140a" : "var(--text-2)", background: isToday ? "var(--gold)" : "transparent" }}>
                          {day}
                        </span>
                        {calDay && (
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: PLATFORM_COLORS[calDay.bestPlatform || "Video"] || "var(--video)" }} />
                          </div>
                        )}
                      </div>
                      {calDay && (
                        <div>
                          <p className="text-[11.5px] leading-snug mb-1.5" style={{
                            color: "var(--text)",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          } as React.CSSProperties}>{calDay.topic}</p>
                          <span className="text-[10px]" style={{ color: PLATFORM_COLORS[calDay.bestPlatform || "Video"] || "var(--video)" }}>
                            {calDay.category}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Slide-over */}
        {selected && (
          <>
            <div className="fixed inset-0 z-[100] animate-fade-in" style={{ background: "rgba(5,5,8,0.55)", backdropFilter: "blur(2px)" }} onClick={() => setSelected(null)} />
            <div className="fixed top-0 right-0 bottom-0 w-[460px] max-w-[92vw] overflow-y-auto z-[101] animate-slide-in"
              style={{ background: "var(--surface)", borderLeft: "1px solid var(--line-2)", boxShadow: "-30px 0 60px -20px rgba(0,0,0,0.7)" }}>
              <div className="px-6 py-5 border-b border-[var(--line)] flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-2" style={{ color: "var(--text-3)" }}>
                    {new Date(selected.calendarDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                  <h2 className="font-serif text-[22px] leading-snug" style={{ color: "var(--text)" }}>{selected.topic}</h2>
                  <div className="flex gap-2 mt-3">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ color: PLATFORM_COLORS[selected.bestPlatform || "Video"], background: (PLATFORM_COLORS[selected.bestPlatform || "Video"] || "var(--video)") + "22" }}>{selected.category}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg bg-transparent border-none cursor-pointer text-[var(--text-2)] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="p-6">
                {selected.hook && <SlideField label="Video Hook" body={`"${selected.hook}"`} />}
                {selected.mainMessage && <SlideField label="Main Message" body={selected.mainMessage} />}
                {selected.bestPlatform && <SlideField label="Best Platform" body={`${selected.bestPlatform} — highest fit for this topic & format`} />}
                {selected.repurposeRecommendation && <SlideField label="Repurpose Recommendation" body={selected.repurposeRecommendation} />}
                {selected.cta && <SlideField label="Call to Action" body={selected.cta} />}
                <Button variant="primary" block className="mt-2"
                  onClick={() => {
                    showToast("Topic loaded into generator", "ok")
                    setSelected(null)
                    router.push(`/video?idea=${encodeURIComponent(selected.topic)}&hook=${encodeURIComponent(selected.hook || "")}`)
                  }}>
                  Use This Topic
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
