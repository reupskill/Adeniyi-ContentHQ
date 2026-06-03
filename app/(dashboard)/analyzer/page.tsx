"use client"
import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Button, ProgressBar, CircularScore, Textarea, Card, GenLoading } from "@/components/ui"
import { useGenerate } from "@/hooks/useGenerate"
import { useAppStore } from "@/store/useAppStore"
import type { ScriptScores } from "@/types"

export default function AnalyzerPage() {
  const [text, setText] = useState("")
  const [scores, setScores] = useState<ScriptScores | null>(null)
  const { showToast } = useAppStore()
  const { generate, isLoading, error } = useGenerate({
    endpoint: "/api/generate/analyse-script",
    onSuccess: (data) => { setScores(data as ScriptScores); showToast("Analysis complete", "ok") },
    onError: (e) => showToast(e, "error"),
  })

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  const getLabel = (score: number) => score >= 90 ? "Exceptional" : score >= 80 ? "Strong" : score >= 70 ? "Competent" : "Needs work"

  return (
    <>
      <Topbar title="Script Analyzer" sub="Score and sharpen your scripts" />
      <div className="px-8 py-7 max-w-[1620px] w-full mx-auto pb-16">
        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 360px", alignItems: "start" }}>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>Script to analyze</span>
              <span className="text-[12px]" style={{ color: "var(--text-3)" }}>{wordCount} words</span>
            </div>
            <Textarea value={text} onChange={(e) => setText(e.target.value)}
              placeholder="Paste your video script here…"
              className="font-mono text-[13px] leading-relaxed"
              style={{ minHeight: 320 }} />
            <Button variant="primary" loading={isLoading} className="mt-4"
              onClick={() => generate({ content: text })}>
              {isLoading ? "Analyzing…" : "Analyze Script"}
            </Button>
            {error && <p className="text-[12px] mt-2" style={{ color: "var(--danger)" }}>{error}</p>}
          </Card>

          <div className="sticky top-[88px]">
            {isLoading ? <GenLoading label="Scoring your script…" /> : !scores ? (
              <Card className="p-5 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full grid place-items-center" style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-line)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
                <p className="font-serif text-[18px] mb-2" style={{ color: "var(--text)" }}>Paste a script to analyze</p>
                <p className="text-[13px]" style={{ color: "var(--text-3)" }}>Scored on hook strength, clarity, depth, emotional impact, and CTA.</p>
              </Card>
            ) : (
              <div className="fade-seq flex flex-col gap-4">
                <Card className="p-5 text-center">
                  <div className="relative inline-block">
                    <CircularScore score={scores.overall} size={140} />
                  </div>
                  <p className="font-serif text-[19px] mt-3" style={{ color: "#58c98d" }}>{getLabel(scores.overall)}</p>
                  <p className="text-[12.5px] mt-1" style={{ color: "var(--text-3)" }}>Overall score</p>
                </Card>
                <Card className="p-5">
                  <p className="text-[14px] font-semibold mb-4" style={{ color: "var(--text)" }}>Breakdown</p>
                  <ProgressBar name="Hook Strength" value={scores.hookStrength} color="#58c98d" />
                  <ProgressBar name="Clarity" value={scores.clarity} color="#58c98d" />
                  <ProgressBar name="Depth" value={scores.depth} color="#58c98d" />
                  <ProgressBar name="Emotional Impact" value={scores.emotionalImpact} color="#46c4ac" />
                  <ProgressBar name="Call to Action" value={scores.callToAction} color="var(--generating)" />
                </Card>
                {scores.tip && (
                  <div className="flex gap-2 p-3.5 rounded-xl" style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-line)" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" className="flex-shrink-0 mt-0.5"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
                    <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--cream)" }}><strong style={{ color: "var(--gold)" }}>AI Tip:</strong> {scores.tip}</p>
                  </div>
                )}
                {scores.strengths?.length > 0 && (
                  <Card className="p-4">
                    <p className="text-[13px] font-semibold mb-3" style={{ color: "var(--ready)" }}>Strengths</p>
                    {scores.strengths.map((s, i) => (
                      <div key={i} className="flex gap-2 text-[13px] mb-2" style={{ color: "var(--text-2)" }}>
                        <span style={{ color: "var(--ready)" }}>✓</span> {s}
                      </div>
                    ))}
                  </Card>
                )}
                {scores.improvements?.length > 0 && (
                  <Card className="p-4">
                    <p className="text-[13px] font-semibold mb-3" style={{ color: "var(--generating)" }}>Improvements</p>
                    {scores.improvements.map((s, i) => (
                      <div key={i} className="flex gap-2 text-[13px] mb-2" style={{ color: "var(--text-2)" }}>
                        <span style={{ color: "var(--generating)" }}>→</span> {s}
                      </div>
                    ))}
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
