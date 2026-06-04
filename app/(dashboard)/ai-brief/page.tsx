"use client"
import { useState, useRef } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Button, Card } from "@/components/ui"
import { useAppStore } from "@/store/useAppStore"

const SECTION_META: Record<string, { color: string; icon: string }> = {
  "1. Top 5 Stories":            { color: "var(--gold)",      icon: "📡" },
  "2. Best Story of the Day":    { color: "var(--video)",     icon: "⭐" },
  "3. Content Angles":           { color: "var(--linkedin)",  icon: "💡" },
  "4. Draft Content Outputs":    { color: "var(--substack)",  icon: "✍️" },
  "Today's Best Content Recommendation": { color: "var(--published)", icon: "🎯" },
}

function renderLine(line: string, i: number): React.ReactNode {
  if (!line.trim()) return <div key={i} className="h-1.5" />

  // Bold italic line (e.g. **Story 1: ...**)
  if (/^\*\*.*\*\*$/.test(line.trim())) {
    return (
      <p key={i} className="text-[13.5px] font-semibold mt-3 mb-1" style={{ color: "var(--text)" }}>
        {line.trim().slice(2, -2)}
      </p>
    )
  }

  // Horizontal rule
  if (line.trim() === "---") return <hr key={i} className="my-4 border-0 border-t border-[var(--line-2)]" />

  // Bullet / list item
  const bulletMatch = line.match(/^[-*]\s+(.+)/)
  if (bulletMatch) {
    return (
      <div key={i} className="flex gap-2.5 my-0.5">
        <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: 1 }}>·</span>
        <span className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>{renderInline(bulletMatch[1])}</span>
      </div>
    )
  }

  // Numbered list item
  const numMatch = line.match(/^(\d+)\.\s+(.+)/)
  if (numMatch) {
    return (
      <div key={i} className="flex gap-2.5 my-1.5">
        <span className="text-[12px] font-semibold flex-shrink-0 mt-0.5 w-5 text-right" style={{ color: "var(--gold)" }}>{numMatch[1]}.</span>
        <span className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>{renderInline(numMatch[2])}</span>
      </div>
    )
  }

  // Label: value line (e.g. **Source & Date:** ...)
  const labelMatch = line.match(/^[-*]?\s*\*\*([^*]+):\*\*\s*(.*)/)
  if (labelMatch) {
    return (
      <div key={i} className="flex gap-2 my-1 flex-wrap">
        <span className="text-[12px] font-semibold flex-shrink-0" style={{ color: "var(--gold)" }}>{labelMatch[1]}:</span>
        <span className="text-[13px]" style={{ color: "var(--text-2)" }}>{renderInline(labelMatch[2])}</span>
      </div>
    )
  }

  // Plain paragraph
  return (
    <p key={i} className="text-[13.5px] leading-relaxed my-0.5" style={{ color: "var(--text-2)" }}>
      {renderInline(line)}
    </p>
  )
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "var(--text)", fontWeight: 600 }}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

function BriefSection({ title, body }: { title: string; body: string }) {
  const meta = Object.entries(SECTION_META).find(([k]) => title.toLowerCase().includes(k.toLowerCase().replace(/^\d+\.\s*/, "")))
  const color = meta?.[1].color || "var(--text-3)"
  const lines = body.split("\n")

  return (
    <Card className="p-5 mb-4" style={{ borderLeft: `3px solid ${color}`, borderRadius: "0 12px 12px 0" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="text-[11px] font-semibold tracking-[0.13em] uppercase" style={{ color }}>
          {title.replace(/^\d+\.\s*/, "")}
        </div>
      </div>
      <div>{lines.map((line, i) => renderLine(line, i))}</div>
    </Card>
  )
}

function parseSections(text: string): Array<{ title: string; body: string }> {
  const parts = text.split(/(?=^### )/m)
  return parts
    .map((part) => {
      const firstNewline = part.indexOf("\n")
      if (firstNewline === -1) return null
      const title = part.slice(0, firstNewline).replace(/^### /, "").trim()
      const body = part.slice(firstNewline + 1).trim()
      return { title, body }
    })
    .filter(Boolean) as Array<{ title: string; body: string }>
}

export default function AIBriefPage() {
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState("")
  const [sections, setSections] = useState<Array<{ title: string; body: string }> | null>(null)
  const { showToast } = useAppStore()
  const abortRef = useRef<AbortController | null>(null)

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })

  const handleGenerate = async () => {
    setStreaming(true)
    setStreamText("")
    setSections(null)
    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/generate/trust-brief", {
        method: "POST",
        signal: abortRef.current.signal,
      })

      if (!res.ok) { showToast("Failed to generate brief", "error"); setStreaming(false); return }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let fullText = ""

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
            if (parsed.text) {
              fullText += parsed.text
              setStreamText(fullText)
            }
            if (parsed.done) {
              setSections(parseSections(fullText))
              showToast("Brief ready", "ok")
            }
            if (parsed.error) showToast(parsed.error, "error")
          } catch {}
        }
      }
    } catch (e: any) {
      if (e.name !== "AbortError") showToast("Generation failed", "error")
    } finally {
      setStreaming(false)
    }
  }

  const wordCount = streamText.split(/\s+/).filter(Boolean).length

  return (
    <>
      <Topbar title="AI Brief" sub="The Trust Economy Brief — daily research & content intelligence" />
      <div className="px-8 py-7 max-w-[900px] w-full mx-auto pb-16">

        {/* Header row */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <p className="text-[13px]" style={{ color: "var(--text-3)" }}>{today}</p>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-faint)" }}>
              Covers: Fintech · AI · Identity · Payments · African Markets · Product · Growth · Leadership · Culture
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {sections && (
              <Button size="sm" variant="secondary"
                onClick={() => navigator.clipboard.writeText(streamText).then(() => showToast("Copied!", "ok"))}>
                Copy Full Brief
              </Button>
            )}
            <Button variant="primary" loading={streaming} onClick={handleGenerate}>
              {streaming ? "Generating…" : sections ? "Regenerate Brief" : "Generate Today's Brief"}
            </Button>
          </div>
        </div>

        {/* Empty state */}
        {!streaming && !sections && (
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
                Your daily research intelligence covering fintech regulation, AI adoption, identity infrastructure, growth signals, leadership lessons, and emerging-market stories — with ready-to-use content angles and draft outputs for X, LinkedIn, and Substack.
              </p>
              <Button variant="primary" loading={streaming} onClick={handleGenerate}>Generate Today's Brief</Button>
            </div>
          </Card>
        )}

        {/* Streaming live preview */}
        {streaming && !sections && (
          streamText ? (
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full animate-pulse-glow" style={{ background: "var(--gold)" }} />
                <span className="text-[12.5px]" style={{ color: "var(--text-3)" }}>
                  Generating brief… {wordCount} words
                </span>
              </div>
              <div className="font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-2)" }}>
                {streamText}
              </div>
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

        {/* Parsed sections */}
        {sections && (
          <div className="fade-seq">
            {/* Stats row */}
            <div className="flex gap-4 mb-5 flex-wrap">
              {[
                { label: "Stories", value: "5" },
                { label: "Content angles", value: "5" },
                { label: "Draft outputs", value: "4" },
                { label: "Words", value: wordCount.toString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                  <span className="text-[15px] font-semibold" style={{ color: "var(--gold)" }}>{value}</span>
                  <span className="text-[12px]" style={{ color: "var(--text-3)" }}>{label}</span>
                </div>
              ))}
            </div>

            {sections.map(({ title, body }) => (
              <BriefSection key={title} title={title} body={body} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
