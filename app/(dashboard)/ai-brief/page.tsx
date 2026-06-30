"use client"
import { useState, useRef, useEffect } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Button, Card, Tabs } from "@/components/ui"
import { useAppStore } from "@/store/useAppStore"

// ─── Markdown rendering ───────────────────────────────────────────────────────

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

function renderLine(line: string, i: number): React.ReactNode {
  if (!line.trim()) return <div key={i} className="h-1.5" />
  if (line.trim() === "---") return <hr key={i} className="my-4 border-0 border-t" style={{ borderColor: "var(--line-2)" }} />

  // Case Study header: skip — rendered by CaseStudyBlock
  if (/^\*\*Case Study \d+:.*\*\*$/.test(line.trim())) return null

  // "Read more" / Search link — renders prominently as a source reference
  const searchMatch = line.match(/^[-*]?\s*\*?\*?Search:\*?\*?\s*(.+)/)
  if (searchMatch) {
    const query = searchMatch[1].trim()
    return (
      <div key={i} className="my-2">
        <a href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-colors no-underline"
          style={{ background: "rgba(10,102,194,0.12)", color: "var(--linkedin)", border: "1px solid rgba(10,102,194,0.2)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Read full story ↗
        </a>
      </div>
    )
  }

  const pubMatch = line.match(/^[-*]?\s*\*?\*?Publication:\*?\*?\s*(.+)/)
  if (pubMatch) {
    return (
      <div key={i} className="flex gap-2 my-0.5 flex-wrap items-center">
        <span style={{ color: "var(--gold)", flexShrink: 0 }}>·</span>
        <span className="text-[12px] font-semibold" style={{ color: "var(--gold)" }}>Source:</span>
        <span className="text-[12.5px] font-medium" style={{ color: "var(--text-2)" }}>{pubMatch[1]}</span>
      </div>
    )
  }

  const dateMatch = line.match(/^[-*]?\s*\*?\*?Date:\*?\*?\s*(.+)/)
  if (dateMatch) {
    return (
      <div key={i} className="flex gap-2 my-0.5 flex-wrap items-center">
        <span style={{ color: "var(--gold)", flexShrink: 0 }}>·</span>
        <span className="text-[11.5px]" style={{ color: "var(--text-3)" }}>{dateMatch[1]}</span>
      </div>
    )
  }

  if (/^\*\*.*\*\*$/.test(line.trim())) {
    return (
      <p key={i} className="text-[13.5px] font-semibold mt-3 mb-1" style={{ color: "var(--text)" }}>
        {line.trim().slice(2, -2)}
      </p>
    )
  }

  const labelMatch = line.match(/^[-*]?\s*\*\*([^*]+):\*\*\s*(.*)/)
  if (labelMatch) {
    const isMyTake = labelMatch[1].toLowerCase().includes("my take")
    return (
      <div key={i} className="flex gap-2 my-1.5 flex-wrap">
        <span className="text-[12px] font-semibold flex-shrink-0"
          style={{ color: isMyTake ? "var(--gold)" : "var(--gold)" }}>{labelMatch[1]}:</span>
        <span className="text-[13px] leading-relaxed"
          style={{ color: isMyTake ? "var(--cream)" : "var(--text-2)", fontStyle: isMyTake ? "italic" : "normal" }}>
          {renderInline(labelMatch[2])}
        </span>
      </div>
    )
  }

  const bulletMatch = line.match(/^[-*]\s+(.+)/)
  if (bulletMatch) {
    return (
      <div key={i} className="flex gap-2.5 my-0.5">
        <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }}>·</span>
        <span className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>{renderInline(bulletMatch[1])}</span>
      </div>
    )
  }

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

// ─── Case study block parsing ─────────────────────────────────────────────────

function parseCaseStudyBlocks(body: string): Array<{ num: string; headline: string; fullBlock: string }> {
  const lines = body.split("\n")
  const blocks: Array<{ num: string; headline: string; lines: string[] }> = []
  let current: { num: string; headline: string; lines: string[] } | null = null

  for (const line of lines) {
    // Match "**Case Study N: Company — description**" or "**Case Study N: Company**"
    const match = line.trim().match(/^\*\*Case Study (\d+): (.+)\*\*$/)
    if (match) {
      if (current) blocks.push(current)
      current = { num: match[1], headline: match[2], lines: [line] }
    } else if (current) {
      if (line.trim() === "---") { blocks.push(current); current = null }
      else current.lines.push(line)
    }
  }
  if (current) blocks.push(current)
  return blocks.map((b) => ({ num: b.num, headline: b.headline, fullBlock: b.lines.join("\n") }))
}

function CaseStudyBlock({
  num, headline, fullBlock, onSave, onNewsletter,
}: {
  num: string
  headline: string
  fullBlock: string
  onSave: (title: string, content: string) => void
  onNewsletter: (headline: string, storyBody: string) => void
}) {
  const bodyLines = fullBlock.split("\n").slice(1)
  // Extract search query for the prominent "Read more" button
  const searchLine = bodyLines.find((l) => /\*?\*?Search:\*?\*?/.test(l))
  const searchQuery = searchLine?.match(/Search:\*?\*?\s*(.+)/)?.[1]?.trim()

  return (
    <div className="mb-5 pb-5" style={{ borderBottom: "1px solid var(--line)" }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1.5">
            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
              style={{ background: "var(--gold-dim)", color: "var(--gold)" }}>
              #{num}
            </span>
            <p className="text-[14px] font-semibold leading-snug" style={{ color: "var(--text)" }}>{headline}</p>
          </div>
          {searchQuery && (
            <a href={`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-lg no-underline transition-colors mb-2"
              style={{ background: "rgba(10,102,194,0.10)", color: "var(--linkedin)", border: "1px solid rgba(10,102,194,0.18)" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Read the full story ↗
            </a>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onSave(headline, fullBlock)}
            className="text-[11px] px-2 py-1 rounded-md border cursor-pointer transition-all"
            style={{ background: "var(--surface-2)", borderColor: "var(--line-2)", color: "var(--text-3)", fontFamily: "inherit" }}>
            + Save
          </button>
          <button
            onClick={() => onNewsletter(headline, fullBlock)}
            className="text-[11px] px-2.5 py-1 rounded-md border cursor-pointer transition-all font-semibold"
            style={{ background: "var(--gold-dim)", borderColor: "var(--gold-line)", color: "var(--gold)", fontFamily: "inherit" }}>
            Write Newsletter →
          </button>
        </div>
      </div>
      <div>{bodyLines.map((line, i) => renderLine(line, i))}</div>
    </div>
  )
}

// ─── Brief section ────────────────────────────────────────────────────────────

const SECTION_COLORS: Record<string, string> = {
  "1": "var(--gold)",
  "2": "var(--video)",
  "3": "var(--linkedin)",
  "4": "var(--substack)",
  "Today": "var(--published)",
}

function BriefSection({
  title, body, onSaveStory, onWriteNewsletter,
}: {
  title: string
  body: string
  onSaveStory?: (title: string, content: string) => void
  onWriteNewsletter?: (headline: string, storyBody: string) => void
}) {
  const num = title.match(/^(\d+)/)?.[1] || (title.startsWith("Today") ? "Today" : "")
  const color = SECTION_COLORS[num] || "var(--text-3)"
  // Section 2 is "The Evidence: 5 Case Studies"
  const isCaseStudies = num === "2"

  return (
    <Card className="p-5 mb-4" style={{ borderLeft: `3px solid ${color}`, borderRadius: "0 12px 12px 0" }}>
      <div className="text-[11px] font-semibold tracking-[0.13em] uppercase mb-4" style={{ color }}>
        {title.replace(/^\d+\.\s*/, "")}
      </div>
      {isCaseStudies && onSaveStory && onWriteNewsletter ? (
        parseCaseStudyBlocks(body).map((block) => (
          <CaseStudyBlock
            key={block.num}
            num={block.num}
            headline={block.headline}
            fullBlock={block.fullBlock}
            onSave={onSaveStory}
            onNewsletter={onWriteNewsletter}
          />
        ))
      ) : (
        <div>{body.split("\n").map((line, i) => renderLine(line, i))}</div>
      )}
    </Card>
  )
}

// ─── Newsletter slide-over ────────────────────────────────────────────────────

function NewsletterSlider({
  headline,
  storyBody,
  onClose,
}: {
  headline: string
  storyBody: string
  onClose: () => void
}) {
  const { showToast } = useAppStore()
  const [streaming, setStreaming] = useState(true)
  const [nlText, setNlText] = useState("")
  const [resharePost, setResharePost] = useState("")
  const [savedId, setSavedId] = useState<string | null>(null)
  const [tab, setTab] = useState<"newsletter" | "reshare">("newsletter")
  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    runGenerate()
    return () => abortRef.current?.abort()
  }, [])

  useEffect(() => {
    if (streaming && scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [nlText])

  const runGenerate = async () => {
    setStreaming(true)
    abortRef.current = new AbortController()
    try {
      const res = await fetch("/api/generate/trust-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, storyBody }),
        signal: abortRef.current.signal,
      })
      if (!res.ok) { showToast("Generation failed", "error"); setStreaming(false); return }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = "", full = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const raw = line.slice(6)
          if (raw === "[DONE]") break
          try {
            const p = JSON.parse(raw)
            if (p.text) { full += p.text; setNlText(full) }
            if (p.done) {
              setResharePost(p.resharePost || "")
              setSavedId(p.id || null)
              showToast("Newsletter saved to Content Bank", "ok")
            }
          } catch {}
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") showToast("Generation failed", "error")
    } finally {
      setStreaming(false)
    }
  }

  const wordCount = nlText.split(/\s+/).filter(Boolean).length
  const done = !streaming && !!nlText

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose} />
      <div className="relative flex flex-col h-full w-full max-w-[700px] shadow-2xl"
        style={{ background: "var(--surface)", borderLeft: "1px solid var(--line-2)" }}>

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--line)" }}>
          <div className="flex-1 min-w-0 pr-4">
            <div className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-1.5"
              style={{ color: "var(--gold)" }}>Trust Economy Brief · LinkedIn + Substack</div>
            <p className="text-[14px] font-semibold leading-snug" style={{ color: "var(--text)" }}>
              {headline}
            </p>
          </div>
          <button onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-lg grid place-items-center cursor-pointer border"
            style={{ background: "var(--surface-2)", borderColor: "var(--line)", color: "var(--text-2)", fontFamily: "inherit" }}>
            ✕
          </button>
        </div>

        {/* Streaming status */}
        {streaming && (
          <div className="flex items-center gap-2.5 px-6 py-2 flex-shrink-0"
            style={{ background: "var(--gold-dim)", borderBottom: "1px solid var(--gold-line)" }}>
            <div className="w-2 h-2 rounded-full animate-pulse-glow flex-shrink-0" style={{ background: "var(--gold)" }} />
            <span className="text-[12px] font-medium" style={{ color: "var(--gold)" }}>
              Writing newsletter… {wordCount} words
            </span>
          </div>
        )}

        {/* Done toolbar */}
        {done && (
          <div className="flex items-center justify-between px-6 py-2.5 flex-shrink-0"
            style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--line)" }}>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <button onClick={() => setTab("newsletter")}
                  className="text-[12px] font-semibold px-3 py-1 rounded-md cursor-pointer border transition-all"
                  style={{
                    background: tab === "newsletter" ? "var(--gold-dim)" : "transparent",
                    borderColor: tab === "newsletter" ? "var(--gold-line)" : "var(--line)",
                    color: tab === "newsletter" ? "var(--gold)" : "var(--text-3)",
                    fontFamily: "inherit",
                  }}>Newsletter</button>
                {resharePost && (
                  <button onClick={() => setTab("reshare")}
                    className="text-[12px] font-semibold px-3 py-1 rounded-md cursor-pointer border transition-all"
                    style={{
                      background: tab === "reshare" ? "var(--surface-3, var(--surface-2))" : "transparent",
                      borderColor: tab === "reshare" ? "var(--text-3)" : "var(--line)",
                      color: tab === "reshare" ? "var(--text)" : "var(--text-3)",
                      fontFamily: "inherit",
                    }}>Reshare</button>
                )}
              </div>
              {savedId && (
                <span className="text-[11.5px] font-medium" style={{ color: "var(--published)" }}>✓ Saved to Bank</span>
              )}
            </div>
            <Button size="sm" variant="secondary"
              onClick={() => {
                const text = tab === "reshare" ? resharePost : nlText
                const label = tab === "reshare" ? "Reshare post copied!" : "Newsletter copied!"
                navigator.clipboard.writeText(text).then(() => showToast(label, "ok"))
              }}>
              Copy
            </Button>
          </div>
        )}

        {/* Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          {!nlText && streaming && (
            <div className="flex flex-col items-center py-20">
              <div className="flex gap-1.5 mb-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full animate-pulse-glow"
                    style={{ background: "var(--gold)", animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
              <p className="text-[13px]" style={{ color: "var(--text-3)" }}>Writing today's newsletter…</p>
            </div>
          )}

          {tab === "newsletter" && nlText && (
            <div className="whitespace-pre-wrap text-[14.5px] leading-[1.8] font-serif pb-8"
              style={{ color: "var(--text-2)" }}>
              {nlText}
              {streaming && (
                <span className="inline-block w-0.5 h-[1em] ml-0.5 animate-pulse"
                  style={{ background: "var(--gold)", verticalAlign: "text-bottom" }} />
              )}
            </div>
          )}

          {tab === "reshare" && done && resharePost && (
            <div className="pb-8">
              <div className="mb-5">
                <p className="text-[12px] font-semibold mb-0.5" style={{ color: "var(--text-2)" }}>Personal reshare</p>
                <p className="text-[11.5px]" style={{ color: "var(--text-3)" }}>Copy and paste to LinkedIn personal feed or WhatsApp — ready to send</p>
              </div>
              <div className="p-5 rounded-xl whitespace-pre-wrap text-[15px] leading-[1.8]"
                style={{ background: "var(--surface-2)", border: "1px solid var(--line-2)", color: "var(--text)", fontFamily: "inherit" }}>
                {resharePost}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Content Lab ──────────────────────────────────────────────────────────────

const LAB_PLATFORMS = [
  { id: "newsletter", label: "Newsletter · Substack", color: "var(--gold)" },
  { id: "linkedin",   label: "LinkedIn Personal",    color: "var(--linkedin)" },
  { id: "video",      label: "Video Script",         color: "var(--video)" },
]

interface LabResult {
  newsletter?: string
  linkedin?: string
  video?: { hook: string; story: string; insight: string; close: string; caption: string }
}

function LabOutput({ result, platforms }: { result: LabResult; platforms: string[] }) {
  const [tab, setTab] = useState(platforms[0])
  const { showToast } = useAppStore()
  const active = LAB_PLATFORMS.filter((p) => platforms.includes(p.id))
  if (!active.length) return null

  return (
    <div>
      {active.length > 1 && (
        <div className="mb-4">
          <Tabs options={active.map((p) => p.label)} value={active.find((p) => p.id === tab)?.label || ""}
            onChange={(l) => setTab(active.find((p) => p.label === l)?.id || "")} />
        </div>
      )}

      {tab === "newsletter" && result.newsletter && (
        <Card className="p-6" style={{ borderLeft: "3px solid var(--gold)", borderRadius: "0 12px 12px 0" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[11px] font-semibold tracking-[0.13em] uppercase" style={{ color: "var(--gold)" }}>
              Newsletter · LinkedIn + Substack
            </div>
            <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(result.newsletter!).then(() => showToast("Newsletter copied!", "ok"))}>Copy</Button>
          </div>
          <div className="whitespace-pre-wrap text-[14.5px] leading-[1.85] font-serif" style={{ color: "var(--text-2)" }}>
            {result.newsletter}
          </div>
        </Card>
      )}

      {tab === "linkedin" && result.linkedin && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl grid place-items-center font-semibold text-[16px]"
                style={{ background: "linear-gradient(135deg, #2e2740, #1a1626)", color: "var(--gold)", border: "1px solid var(--line-2)" }}>A</div>
              <div>
                <div className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Adeniyi</div>
                <div className="text-[12px]" style={{ color: "var(--text-3)" }}>Founder / Product Leader · Just now</div>
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(result.linkedin!).then(() => showToast("Copied!", "ok"))}>Copy</Button>
          </div>
          <div className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--cream)" }}>{result.linkedin}</div>
        </Card>
      )}

      {tab === "video" && result.video && (
        <div className="flex flex-col gap-3">
          {(["hook", "story", "insight", "close", "caption"] as const).map((key) => result.video![key] && (
            <Card key={key} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] font-semibold tracking-[0.13em] uppercase" style={{ color: "var(--video)" }}>{key.toUpperCase()}</div>
                <button onClick={() => navigator.clipboard.writeText(result.video![key]).then(() => showToast("Copied!", "ok"))}
                  className="text-[11px] px-2 py-0.5 rounded border cursor-pointer"
                  style={{ color: "var(--text-3)", background: "transparent", borderColor: "var(--line)", fontFamily: "inherit" }}>Copy</button>
              </div>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--cream)" }}>{result.video![key]}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

function parseSections(text: string): Array<{ title: string; body: string }> {
  const parts = text.split(/(?=^### )/m)
  return parts
    .map((part) => {
      const nl = part.indexOf("\n")
      if (nl === -1) return null
      return { title: part.slice(0, nl).replace(/^### /, "").trim(), body: part.slice(nl + 1).trim() }
    })
    .filter(Boolean) as Array<{ title: string; body: string }>
}

export default function AIBriefPage() {
  const [activeTab, setActiveTab] = useState("Daily Brief")
  const { showToast } = useAppStore()

  // Daily Brief
  const [briefStreaming, setBriefStreaming] = useState(false)
  const [streamText, setStreamText] = useState("")
  const [sections, setSections] = useState<Array<{ title: string; body: string }> | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Newsletter slide-over
  const [nlSlider, setNlSlider] = useState<{ headline: string; storyBody: string } | null>(null)

  // Content Lab
  const [labIdea, setLabIdea] = useState("")
  const [labPlatforms, setLabPlatforms] = useState<Set<string>>(new Set(["newsletter"]))
  const [labLoading, setLabLoading] = useState(false)
  const [labResult, setLabResult] = useState<LabResult | null>(null)
  const [labSelectedPlatforms, setLabSelectedPlatforms] = useState<string[]>([])

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  const wordCount = streamText.split(/\s+/).filter(Boolean).length

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

  const togglePlatform = (id: string) => {
    setLabPlatforms((prev) => {
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

        {/* ── Daily Brief ── */}
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
                  <BriefSection
                    key={title}
                    title={title}
                    body={body}
                    onSaveStory={saveStoryToBank}
                    onWriteNewsletter={(headline, storyBody) => setNlSlider({ headline, storyBody })}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Content Lab ── */}
        {activeTab === "Content Lab" && (
          <>
            <Card className="p-5 mb-5">
              <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--text)" }}>What's the idea?</p>
              <p className="text-[12.5px] mb-4" style={{ color: "var(--text-3)" }}>Drop a raw idea, topic, or observation. The AI writes the complete piece — publication-ready, Nigerian context where it applies, global framing throughout. Copy and publish.</p>
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

      {/* Newsletter slide-over */}
      {nlSlider && (
        <NewsletterSlider
          headline={nlSlider.headline}
          storyBody={nlSlider.storyBody}
          onClose={() => setNlSlider(null)}
        />
      )}
    </>
  )
}
