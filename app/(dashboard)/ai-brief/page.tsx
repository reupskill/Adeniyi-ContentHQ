"use client"
import { useState, useRef } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Button, Card, Tabs } from "@/components/ui"
import { useAppStore } from "@/store/useAppStore"

// ─── Markdown rendering ──────────────────────────────────────────────────────

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} style={{ color: "var(--text)", fontWeight: 600 }}>{part.slice(2, -2)}</strong>
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

function buildSearchUrl(headline: string, publication: string, searchQuery: string) {
  const q = searchQuery || `${headline} ${publication}`
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`
}

function renderLine(line: string, i: number, onSaveStory?: (title: string, body: string) => void): React.ReactNode {
  if (!line.trim()) return <div key={i} className="h-1.5" />
  if (line.trim() === "---") return <hr key={i} className="my-4 border-0 border-t" style={{ borderColor: "var(--line-2)" }} />

  // Story header: **Story N: headline**
  const storyMatch = line.trim().match(/^\*\*Story (\d+): (.+)\*\*$/)
  if (storyMatch) {
    return (
      <div key={i} className="flex items-start justify-between gap-3 mt-4 mb-2">
        <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>
          <span className="text-[11px] font-semibold mr-2 px-1.5 py-0.5 rounded" style={{ background: "var(--gold-dim)", color: "var(--gold)" }}>
            #{storyMatch[1]}
          </span>
          {storyMatch[2]}
        </p>
        {onSaveStory && (
          <button
            onClick={() => onSaveStory(storyMatch[2], line)}
            className="flex-shrink-0 text-[11px] px-2 py-1 rounded-md border cursor-pointer transition-all"
            style={{ background: "var(--gold-dim)", borderColor: "var(--gold-line)", color: "var(--gold)", fontFamily: "inherit" }}>
            + Save to Bank
          </button>
        )}
      </div>
    )
  }

  // Other bold-only lines
  if (/^\*\*.*\*\*$/.test(line.trim())) {
    return (
      <p key={i} className="text-[13.5px] font-semibold mt-3 mb-1" style={{ color: "var(--text)" }}>
        {line.trim().slice(2, -2)}
      </p>
    )
  }

  // Source search link: - Search: [query]
  const searchMatch = line.match(/^[-*]\s*\*?Search:\*?\s*(.+)/)
  if (searchMatch) {
    return (
      <div key={i} className="flex gap-2.5 my-0.5 items-center">
        <span style={{ color: "var(--gold)", flexShrink: 0 }}>·</span>
        <span className="text-[12.5px]" style={{ color: "var(--text-3)" }}>Search:</span>
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(searchMatch[1])}`}
          target="_blank" rel="noopener noreferrer"
          className="text-[12.5px] underline decoration-dotted transition-colors"
          style={{ color: "var(--linkedin)" }}>
          {searchMatch[1]} ↗
        </a>
      </div>
    )
  }

  // Publication line: - Publication: [name]
  const pubMatch = line.match(/^[-*]\s*\*?Publication:\*?\s*(.+)/)
  if (pubMatch) {
    return (
      <div key={i} className="flex gap-2 my-0.5 flex-wrap items-center">
        <span style={{ color: "var(--gold)", flexShrink: 0 }}>·</span>
        <span className="text-[12px] font-semibold" style={{ color: "var(--gold)" }}>Source:</span>
        <span className="text-[12.5px] font-medium" style={{ color: "var(--text-2)" }}>{pubMatch[1]}</span>
      </div>
    )
  }

  // Label: value line (- **Label:** value)
  const labelMatch = line.match(/^[-*]?\s*\*\*([^*]+):\*\*\s*(.*)/)
  if (labelMatch) {
    return (
      <div key={i} className="flex gap-2 my-1 flex-wrap">
        <span className="text-[12px] font-semibold flex-shrink-0" style={{ color: "var(--gold)" }}>{labelMatch[1]}:</span>
        <span className="text-[13px]" style={{ color: "var(--text-2)" }}>{renderInline(labelMatch[2])}</span>
      </div>
    )
  }

  // Bullet
  const bulletMatch = line.match(/^[-*]\s+(.+)/)
  if (bulletMatch) {
    return (
      <div key={i} className="flex gap-2.5 my-0.5">
        <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }}>·</span>
        <span className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>{renderInline(bulletMatch[1])}</span>
      </div>
    )
  }

  // Numbered list
  const numMatch = line.match(/^(\d+)\.\s+(.+)/)
  if (numMatch) {
    return (
      <div key={i} className="flex gap-2.5 my-1.5">
        <span className="text-[12px] font-semibold flex-shrink-0 mt-0.5 w-5 text-right" style={{ color: "var(--gold)" }}>{numMatch[1]}.</span>
        <span className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>{renderInline(numMatch[2])}</span>
      </div>
    )
  }

  return (
    <p key={i} className="text-[13.5px] leading-relaxed my-0.5" style={{ color: "var(--text-2)" }}>
      {renderInline(line)}
    </p>
  )
}

const SECTION_COLORS: Record<string, string> = {
  "1": "var(--gold)",
  "2": "var(--video)",
  "3": "var(--linkedin)",
  "4": "var(--substack)",
  "Today": "var(--published)",
}

function BriefSection({
  title, body, onSaveStory
}: {
  title: string
  body: string
  onSaveStory?: (storyTitle: string, content: string) => void
}) {
  const num = title.match(/^(\d+)/)?.[1] || (title.startsWith("Today") ? "Today" : "")
  const color = SECTION_COLORS[num] || "var(--text-3)"
  const isStories = num === "1"
  const lines = body.split("\n")

  return (
    <Card className="p-5 mb-4" style={{ borderLeft: `3px solid ${color}`, borderRadius: "0 12px 12px 0" }}>
      <div className="text-[11px] font-semibold tracking-[0.13em] uppercase mb-4" style={{ color }}>
        {title.replace(/^\d+\.\s*/, "")}
      </div>
      <div>
        {lines.map((line, i) =>
          renderLine(line, i, isStories ? onSaveStory : undefined)
        )}
      </div>
    </Card>
  )
}

function parseSections(text: string): Array<{ title: string; body: string }> {
  const parts = text.split(/(?=^### )/m)
  return parts
    .map((part) => {
      const nl = part.indexOf("\n")
      if (nl === -1) return null
      return {
        title: part.slice(0, nl).replace(/^### /, "").trim(),
        body: part.slice(nl + 1).trim(),
      }
    })
    .filter(Boolean) as Array<{ title: string; body: string }>
}

// ─── Content Lab ─────────────────────────────────────────────────────────────

const LAB_PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", color: "var(--linkedin)" },
  { id: "x",        label: "X / Twitter", color: "#46c4ac" },
  { id: "video",    label: "Video Script", color: "var(--video)" },
  { id: "substack", label: "Substack", color: "var(--substack)" },
]

interface LabResult {
  linkedin?: string
  x?: string[]
  video?: { hook: string; story: string; insight: string; close: string; caption: string }
  substack?: { title: string; subtitle: string; opening: string; section1: string; section2: string; section3: string; closing: string }
}

function LabOutput({ result, platforms }: { result: LabResult; platforms: string[] }) {
  const [tab, setTab] = useState(platforms[0])
  const { showToast } = useAppStore()

  const activePlatforms = LAB_PLATFORMS.filter(p => platforms.includes(p.id))
  if (!activePlatforms.length) return null

  return (
    <div>
      {activePlatforms.length > 1 && (
        <div className="mb-4">
          <Tabs options={activePlatforms.map(p => p.label)} value={activePlatforms.find(p => p.id === tab)?.label || ""} onChange={(l) => setTab(activePlatforms.find(p => p.label === l)?.id || "")} />
        </div>
      )}

      {tab === "linkedin" && result.linkedin && (
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl grid place-items-center font-semibold text-[16px]"
              style={{ background: "linear-gradient(135deg, #2e2740, #1a1626)", color: "var(--gold)", border: "1px solid var(--line-2)" }}>A</div>
            <div>
              <div className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Adeniyi</div>
              <div className="text-[12px]" style={{ color: "var(--text-3)" }}>Founder / Product Leader · 2nd</div>
            </div>
          </div>
          <div className="text-[14px] leading-relaxed whitespace-pre-wrap mb-4" style={{ color: "var(--cream)" }}>{result.linkedin}</div>
          <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(result.linkedin!).then(() => showToast("Copied!", "ok"))}>Copy</Button>
        </Card>
      )}

      {tab === "x" && result.x && (
        <div className="flex flex-col gap-3">
          {result.x.map((tweet, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full grid place-items-center font-semibold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #2e2740, #1a1626)", color: "var(--gold)", border: "1px solid var(--line-2)" }}>A</div>
                <div className="flex-1">
                  {i > 0 && <div className="text-[11px] font-semibold mb-1" style={{ color: "var(--text-3)" }}>Tweet {i + 1}</div>}
                  <p className="text-[14px] leading-relaxed" style={{ color: "var(--cream)" }}>{tweet}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--line)" }}>
                <span className="text-[12px]" style={{ color: tweet.length > 260 ? "var(--danger)" : "var(--text-3)" }}>{tweet.length}/280</span>
                <button onClick={() => navigator.clipboard.writeText(tweet).then(() => showToast("Copied!", "ok"))}
                  className="text-[11.5px] px-2 py-1 rounded-md border cursor-pointer"
                  style={{ color: "var(--text-3)", background: "transparent", borderColor: "var(--line)", fontFamily: "inherit" }}>Copy</button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "video" && result.video && (
        <div className="flex flex-col gap-3">
          {(["hook", "story", "insight", "close", "caption"] as const).map((key) => result.video![key] && (
            <Card key={key} className="p-4">
              <div className="text-[11px] font-semibold tracking-[0.13em] uppercase mb-2" style={{ color: "var(--video)" }}>{key.toUpperCase()}</div>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--cream)" }}>{result.video![key]}</p>
            </Card>
          ))}
        </div>
      )}

      {tab === "substack" && result.substack && (
        <div className="flex flex-col gap-3">
          <Card className="p-4" style={{ borderLeft: "3px solid var(--substack)", borderRadius: "0 12px 12px 0" }}>
            <div className="text-[11px] font-semibold tracking-[0.13em] uppercase mb-1" style={{ color: "var(--substack)" }}>TITLE</div>
            <p className="font-serif text-[19px]" style={{ color: "var(--text)" }}>{result.substack.title}</p>
            {result.substack.subtitle && <p className="text-[13px] mt-1" style={{ color: "var(--text-3)" }}>{result.substack.subtitle}</p>}
          </Card>
          {(["opening", "section1", "section2", "section3", "closing"] as const).map((key) => result.substack![key] && (
            <Card key={key} className="p-4">
              <div className="text-[11px] font-semibold tracking-[0.13em] uppercase mb-2" style={{ color: "var(--substack)" }}>{key.replace(/(\d)/, " $1").toUpperCase()}</div>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--cream)" }}>{result.substack![key]}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AIBriefPage() {
  const [activeTab, setActiveTab] = useState("Daily Brief")
  const { showToast } = useAppStore()

  // Daily Brief state
  const [briefStreaming, setBriefStreaming] = useState(false)
  const [streamText, setStreamText] = useState("")
  const [sections, setSections] = useState<Array<{ title: string; body: string }> | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Content Lab state
  const [labIdea, setLabIdea] = useState("")
  const [labPlatforms, setLabPlatforms] = useState<Set<string>>(new Set(["linkedin"]))
  const [labLoading, setLabLoading] = useState(false)
  const [labResult, setLabResult] = useState<LabResult | null>(null)
  const [labSelectedPlatforms, setLabSelectedPlatforms] = useState<string[]>([])

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  const wordCount = streamText.split(/\s+/).filter(Boolean).length

  // ── Daily Brief ──

  const generateBrief = async () => {
    setBriefStreaming(true)
    setStreamText("")
    setSections(null)
    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/generate/trust-brief", { method: "POST", signal: abortRef.current.signal })
      if (!res.ok) { showToast("Failed to generate brief", "error"); return }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = "", fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const data = line.slice(6)
          if (data === "[DONE]") break
          try {
            const parsed = JSON.parse(data)
            if (parsed.text) { fullText += parsed.text; setStreamText(fullText) }
            if (parsed.done) { setSections(parseSections(fullText)); showToast("Brief ready", "ok") }
          } catch {}
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") showToast("Generation failed", "error")
    } finally {
      setBriefStreaming(false)
    }
  }

  const saveStoryToBank = async (title: string, content: string) => {
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.slice(0, 120), platform: "LinkedIn", category: "Leadership", status: "Idea", content, raw_inputs: { source: "AI Brief" } }),
      })
      if (res.ok) showToast("Saved to Content Bank", "ok")
      else showToast("Failed to save", "error")
    } catch { showToast("Failed to save", "error") }
  }

  // ── Content Lab ──

  const togglePlatform = (id: string) => {
    setLabPlatforms(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const generateLab = async () => {
    if (!labIdea.trim()) { showToast("Enter an idea first", "error"); return }
    if (!labPlatforms.size) { showToast("Select at least one platform", "error"); return }

    setLabLoading(true)
    setLabResult(null)
    const platforms = Array.from(labPlatforms)
    setLabSelectedPlatforms(platforms)

    try {
      const res = await fetch("/api/generate/content-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: labIdea, platforms }),
      })
      const data = await res.json()
      if (!res.ok) { showToast(data.error || "Generation failed", "error"); return }
      setLabResult(data.content)
      showToast("Content generated", "ok")
    } catch { showToast("Generation failed", "error") }
    finally { setLabLoading(false) }
  }

  return (
    <>
      <Topbar title="AI" sub="Daily intelligence · content generation" />
      <div className="px-8 py-7 max-w-[900px] w-full mx-auto pb-16">
        <div className="mb-6">
          <Tabs options={["Daily Brief", "Content Lab"]} value={activeTab} onChange={setActiveTab} />
        </div>

        {/* ── Daily Brief tab ── */}
        {activeTab === "Daily Brief" && (
          <>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <p className="text-[13px]" style={{ color: "var(--text-3)" }}>{today}</p>
                <p className="text-[11.5px] mt-0.5" style={{ color: "var(--text-faint)" }}>
                  Trust Economy · Fintech · AI · Identity · Payments · Africa · Product · Growth · Leadership
                </p>
              </div>
              <div className="flex gap-2">
                {sections && (
                  <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(streamText).then(() => showToast("Copied!", "ok"))}>
                    Copy Full Brief
                  </Button>
                )}
                <Button variant="primary" loading={briefStreaming} onClick={generateBrief}>
                  {briefStreaming ? "Generating…" : sections ? "Regenerate" : "Generate Today's Brief"}
                </Button>
              </div>
            </div>

            {!briefStreaming && !sections && (
              <Card>
                <div className="text-center py-16 px-8">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl grid place-items-center"
                    style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-line)" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <line x1="10" y1="9" x2="8" y2="9"/>
                    </svg>
                  </div>
                  <p className="font-serif text-[21px] mb-2" style={{ color: "var(--text)" }}>The Trust Economy Brief</p>
                  <p className="text-[13px] max-w-[460px] mx-auto leading-relaxed mb-6" style={{ color: "var(--text-3)" }}>
                    Daily research intelligence with 5 stories, content angles, and ready-to-publish drafts for X, LinkedIn, and Substack — all through the Trust Economy lens.
                  </p>
                  <Button variant="primary" onClick={generateBrief}>Generate Today's Brief</Button>
                </div>
              </Card>
            )}

            {briefStreaming && !sections && (
              streamText ? (
                <Card className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 rounded-full animate-pulse-glow" style={{ background: "var(--gold)" }} />
                    <span className="text-[12.5px]" style={{ color: "var(--text-3)" }}>Generating… {wordCount} words</span>
                  </div>
                  <div className="font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-2)" }}>{streamText}</div>
                </Card>
              ) : (
                <Card>
                  <div className="text-center py-16">
                    <div className="flex justify-center gap-1.5 mb-4">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-2 h-2 rounded-full animate-pulse-glow"
                          style={{ background: "var(--gold)", animationDelay: `${i * 0.2}s` }} />
                      ))}
                    </div>
                    <p className="text-[13px]" style={{ color: "var(--text-3)" }}>Researching today's stories…</p>
                  </div>
                </Card>
              )
            )}

            {sections && (
              <div className="fade-seq">
                <div className="flex gap-3 mb-5 flex-wrap">
                  {[{ label: "Stories", value: "5" }, { label: "Angles", value: "5" }, { label: "Drafts", value: "4" }, { label: "Words", value: wordCount.toString() }].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                      <span className="text-[15px] font-semibold" style={{ color: "var(--gold)" }}>{value}</span>
                      <span className="text-[12px]" style={{ color: "var(--text-3)" }}>{label}</span>
                    </div>
                  ))}
                </div>
                {sections.map(({ title, body }) => (
                  <BriefSection key={title} title={title} body={body} onSaveStory={saveStoryToBank} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Content Lab tab ── */}
        {activeTab === "Content Lab" && (
          <>
            <Card className="p-5 mb-5">
              <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--text)" }}>What's the idea?</p>
              <p className="text-[12.5px] mb-4" style={{ color: "var(--text-3)" }}>Drop a raw idea, topic, or observation. The AI will figure out the angle and produce platform-ready content.</p>
              <textarea
                className="w-full rounded-xl text-[14px] leading-relaxed resize-none outline-none px-4 py-3"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--line-2)",
                  color: "var(--text)",
                  minHeight: 120,
                  fontFamily: "inherit",
                }}
                value={labIdea}
                onChange={(e) => setLabIdea(e.target.value)}
                placeholder="e.g. Most founders confuse activity with execution. They celebrate being busy instead of measuring what actually moved the needle…"
              />

              <div className="mt-4 mb-4">
                <p className="text-[11.5px] font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: "var(--text-3)" }}>Generate for</p>
                <div className="flex gap-2 flex-wrap">
                  {LAB_PLATFORMS.map(({ id, label, color }) => {
                    const on = labPlatforms.has(id)
                    return (
                      <button key={id} onClick={() => togglePlatform(id)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium border cursor-pointer transition-all"
                        style={{
                          background: on ? `${color}22` : "var(--surface-2)",
                          borderColor: on ? color : "var(--line-2)",
                          color: on ? color : "var(--text-2)",
                          fontFamily: "inherit",
                        }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: on ? color : "var(--text-3)" }} />
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button variant="primary" loading={labLoading} onClick={generateLab} disabled={!labIdea.trim() || !labPlatforms.size}>
                {labLoading ? "Generating…" : `Generate for ${labPlatforms.size} platform${labPlatforms.size !== 1 ? "s" : ""}`}
              </Button>
            </Card>

            {labLoading && (
              <Card>
                <div className="text-center py-12">
                  <div className="flex justify-center gap-1.5 mb-4">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full animate-pulse-glow"
                        style={{ background: "var(--gold)", animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                  <p className="text-[13px]" style={{ color: "var(--text-3)" }}>Writing content for {labSelectedPlatforms.length} platform{labSelectedPlatforms.length !== 1 ? "s" : ""}…</p>
                </div>
              </Card>
            )}

            {labResult && !labLoading && (
              <div className="fade-seq">
                <LabOutput result={labResult} platforms={labSelectedPlatforms} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
