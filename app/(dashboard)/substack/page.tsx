"use client"
import { useRef } from "react"
import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { InputPanel, GeneratorInputs } from "@/components/generators/InputPanel"
import { PlatformSwitcher } from "@/components/generators/PlatformSwitcher"
import { Button, OutputCard, GenLoading, GenEmpty, Card } from "@/components/ui"
import { useGeneratorInit } from "@/hooks/useGeneratorInit"
import { useAppStore } from "@/store/useAppStore"

const SECTIONS = [
  { key: "titleOptions",         label: "TITLE OPTIONS",         color: "var(--video)" },
  { key: "subtitle",             label: "SUBTITLE",              color: "var(--linkedin)" },
  { key: "openingStory",         label: "OPENING STORY",         color: "var(--substack)" },
  { key: "mainArgument",         label: "MAIN ARGUMENT",         color: "var(--gold)" },
  { key: "section1",             label: "SECTION 1",             color: "var(--ready)" },
  { key: "section2",             label: "SECTION 2",             color: "var(--ready)" },
  { key: "section3",             label: "SECTION 3",             color: "var(--ready)" },
  { key: "practicalReflection",  label: "PRACTICAL REFLECTION",  color: "var(--c-teal, #46c4ac)" },
  { key: "closingParagraph",     label: "CLOSING PARAGRAPH",     color: "var(--video)" },
  { key: "newsletterCta",        label: "NEWSLETTER CTA",        color: "var(--gold)" },
]

export default function SubstackPage() {
  const { inputs, setInputs, prefilled } = useGeneratorInit("substack")
  const [streaming, setStreaming] = useState(false)
  const [streamText, setStreamText] = useState("")
  const [sections, setSections] = useState<Record<string, string> | null>(null)
  const [teaser, setTeaser] = useState<string>("")
  const { showToast } = useAppStore()
  const abortRef = useRef<AbortController | null>(null)

  const set = (k: keyof GeneratorInputs, v: string | number) => setInputs((p) => ({ ...p, [k]: v }))

  const handleGenerate = async () => {
    setStreaming(true)
    setStreamText("")
    setSections(null)
    setTeaser("")
    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/generate/substack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inputs }),
        signal: abortRef.current.signal,
      })

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

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
            if (parsed.text) setStreamText((t) => t + parsed.text)
            if (parsed.done) {
              const allSections = parsed.sections || {}
              const { teaser: t, ...rest } = allSections
              setSections(rest)
              if (t) setTeaser(t)
              showToast("Essay generated and saved", "ok")
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

  const wordCount = streamText.split(/\s+/).filter(Boolean).length

  return (
    <>
      <Topbar title="Substack Essay Builder" sub="Long-form thinking, fully structured" />
      <div className="px-8 py-7 max-w-[1620px] w-full mx-auto pb-16">
        <PlatformSwitcher idea={inputs.idea} />
        <div className="grid gap-5" style={{ gridTemplateColumns: "344px 1fr", alignItems: "start" }}>
          <Card className="p-5 sticky top-[88px]">
            <div className="text-[16px] font-semibold mb-4" style={{ color: "var(--text)" }}>Essay Inputs</div>
            <InputPanel values={inputs} onChange={set} prefilled={prefilled ?? undefined}
              fields={["idea", "story", "audience", "lesson", "business"]} />
            <Button variant="primary" block loading={streaming} className="mt-1.5" onClick={handleGenerate}>
              {streaming ? "Writing essay…" : "Generate Essay"}
            </Button>
          </Card>

          <div>
            {streaming && !sections ? (
              streamText
                ? (
                  <Card className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px]" style={{ color: "var(--text-2)" }}>Streaming essay… {wordCount} words</span>
                    </div>
                    <div className="font-mono text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--cream)" }}>{streamText}</div>
                  </Card>
                )
                : <GenLoading label="Writing your Substack essay…" />
            ) : !sections
              ? <GenEmpty title="Your essay will appear here" sub="Fill in the inputs and hit Generate. Output is structured into titled sections for easy editing." />
              : (
                <div className="fade-seq">
                  <Card className="p-4 mb-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full" style={{ color: "var(--substack)", background: "var(--substack-bg)" }}>Substack</span>
                      <span className="text-[12.5px]" style={{ color: "var(--text-3)" }}>~{Math.ceil(wordCount / 200)} min read · {wordCount} words</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(streamText).then(() => showToast("Copied!", "ok"))}>Copy Full Draft</Button>
                      <Button size="sm" variant="secondary" onClick={() => showToast("Saved to Content Bank", "ok")}>Save to Bank</Button>
                    </div>
                  </Card>
                  {SECTIONS.map(({ key, label, color }, i) => {
                    const body = sections[key]
                    if (!body) return null
                    return (
                      <div key={key} style={{ animation: `fadeUp .5s ${i * 70}ms backwards`, borderLeft: `3px solid ${color}`, marginBottom: 14, borderRadius: "0 12px 12px 0" }}>
                        <OutputCard label={label} body={body} />
                      </div>
                    )
                  })}

                  {teaser && (
                    <Card className="p-5 mt-2" style={{ borderLeft: "3px solid var(--gold)", borderRadius: "0 12px 12px 0", background: "linear-gradient(135deg, rgba(201,169,110,0.07), transparent)" }}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="text-[11px] font-semibold tracking-[0.13em] uppercase mb-0.5" style={{ color: "var(--gold)" }}>Teaser</div>
                          <div className="text-[11.5px]" style={{ color: "var(--text-3)" }}>Share this on LinkedIn or X to drive readers to the full essay</div>
                        </div>
                        <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(teaser).then(() => showToast("Teaser copied!", "ok"))}>Copy</Button>
                      </div>
                      <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--cream)", fontFamily: "var(--font-serif, serif)" }}>{teaser}</p>
                    </Card>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  )
}
