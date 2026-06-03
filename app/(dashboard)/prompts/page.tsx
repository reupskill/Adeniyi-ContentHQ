"use client"
import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Button, Textarea, Field, GenLoading, Card } from "@/components/ui"
import { useGenerate } from "@/hooks/useGenerate"
import { useAppStore } from "@/store/useAppStore"

const PROMPT_TYPES = [
  { id: "video_script", label: "Generate Video Script", sub: "45-60 second script" },
  { id: "substack", label: "Expand into Substack", sub: "Full essay structure" },
  { id: "linkedin", label: "Convert to LinkedIn", sub: "Polished post" },
  { id: "x_thread", label: "Convert to X Thread", sub: "5-tweet thread" },
  { id: "hooks", label: "Create 10 Hooks", sub: "Scroll-stopping openers" },
  { id: "improve", label: "Improve This Script", sub: "More natural & grounded" },
  { id: "natural", label: "Make More Natural", sub: "Spoken language rewrite" },
  { id: "philosophical", label: "Make More Philosophical", sub: "Stoic depth" },
  { id: "personal", label: "Make More Personal", sub: "Deepen the story" },
  { id: "founder", label: "Make Founder-Led", sub: "Builder's lens" },
  { id: "carousel", label: "Create Carousel Slides", sub: "7-slide structure" },
]

export default function PromptsPage() {
  const [selected, setSelected] = useState("video_script")
  const [context, setContext] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const { showToast } = useAppStore()
  const { generate, isLoading, error } = useGenerate({
    endpoint: "/api/generate/prompt",
    onSuccess: (data: any) => {
      setResult(data.result)
      showToast("Prompt generated", "ok")
    },
    onError: (e) => showToast(e, "error"),
  })

  return (
    <>
      <Topbar title="Prompt Generator" sub="Copy-ready prompts for Claude or ChatGPT" />
      <div className="px-8 py-7 max-w-[1620px] w-full mx-auto pb-16">
        <div className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-3" style={{ color: "var(--text-3)" }}>Choose a prompt type</div>
        <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
          {PROMPT_TYPES.map((p) => (
            <button key={p.id} onClick={() => setSelected(p.id)}
              className="flex items-center gap-3 p-3.5 rounded-xl text-left cursor-pointer border transition-all"
              style={{
                fontFamily: "inherit",
                background: selected === p.id ? "var(--gold-dim)" : "var(--surface)",
                borderColor: selected === p.id ? "var(--gold-line)" : "var(--line)",
              }}>
              <div className="w-9 h-9 rounded-[10px] flex-shrink-0 grid place-items-center"
                style={{ background: selected === p.id ? "rgba(201,169,110,0.18)" : "var(--surface-2)", color: selected === p.id ? "var(--gold)" : "var(--text-2)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              </div>
              <div>
                <div className="text-[13.5px] font-semibold" style={{ color: selected === p.id ? "var(--cream)" : "var(--text)" }}>{p.label}</div>
                <div className="text-[11.5px]" style={{ color: "var(--text-3)" }}>{p.sub}</div>
              </div>
              {selected === p.id && <svg className="ml-auto flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="var(--gold)" fillOpacity="0.2" stroke="var(--gold)" strokeWidth="2"/><polyline points="9 12 11 14 15 10" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round"/></svg>}
            </button>
          ))}
        </div>

        <Card className="p-5 mb-5">
          <Field label="Paste your idea or draft here">
            <Textarea value={context} onChange={(e) => setContext(e.target.value)}
              placeholder="Drop in a raw idea, a rough draft, or a finished script you want to transform…"
              style={{ minHeight: 120 }} />
          </Field>
          <Button variant="primary" loading={isLoading} onClick={() => generate({ promptType: selected, context })}>
            {isLoading ? "Building prompt…" : "Generate Prompt"}
          </Button>
          {error && <p className="text-[12px] mt-2" style={{ color: "var(--danger)" }}>{error}</p>}
        </Card>

        {isLoading && <GenLoading label="Assembling your prompt…" />}

        {result && !isLoading && (
          <Card className="p-5 fade-seq">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>Generated Prompt</span>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(result).then(() => showToast("Copied!", "ok"))}
                  className="inline-flex items-center gap-1.5 text-[11.5px] px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors"
                  style={{ color: "var(--text-3)", background: "transparent", borderColor: "var(--line)", fontFamily: "inherit" }}>
                  Copy prompt
                </button>
                <Button size="sm" variant="secondary" onClick={() => showToast("Saved to Content Bank", "ok")}>Save to Bank</Button>
              </div>
            </div>
            <div className="font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap p-4 rounded-xl"
              style={{ background: "#0c0c14", border: "1px solid var(--line)", color: "#d7cfc0" }}>
              {result}
            </div>
          </Card>
        )}
      </div>
    </>
  )
}
