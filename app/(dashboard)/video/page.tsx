"use client"
import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { InputPanel, GeneratorInputs } from "@/components/generators/InputPanel"
import { PlatformSwitcher } from "@/components/generators/PlatformSwitcher"
import { Button, OutputCard, GenLoading, GenEmpty, Card } from "@/components/ui"
import { useGenerate } from "@/hooks/useGenerate"
import { useGeneratorInit } from "@/hooks/useGeneratorInit"
import { useAppStore } from "@/store/useAppStore"

interface ScriptOutput {
  id: string
  sections: {
    hook: string
    story: string
    insight: string
    close: string
    caption: string
    onScreenText: string
    brollIdeas: string
    musicMood: string
    recordingDirection: string
  }
}

const SECTION_LABELS: Record<string, string> = {
  hook: "HOOK",
  story: "STORY",
  insight: "INSIGHT",
  close: "CLOSE",
  caption: "CAPTION",
  onScreenText: "ON-SCREEN TEXT",
  brollIdeas: "B-ROLL IDEAS",
  musicMood: "MUSIC MOOD",
  recordingDirection: "RECORDING DIRECTION",
}

export default function VideoPage() {
  const { inputs, setInputs, prefilled } = useGeneratorInit("video")
  const [result, setResult] = useState<ScriptOutput | null>(null)
  const { showToast } = useAppStore()
  const { generate, isLoading, error } = useGenerate({
    endpoint: "/api/generate/video-script",
    onSuccess: (data) => {
      setResult(data as ScriptOutput)
      showToast("Script generated and saved", "ok")
    },
    onError: (e) => showToast(e, "error"),
  })

  const set = (k: keyof GeneratorInputs, v: string | number) => setInputs((prev) => ({ ...prev, [k]: v }))

  const handleGenerate = () => generate({
    idea: inputs.idea,
    story: inputs.story,
    audience: inputs.audience,
    lesson: inputs.lesson,
    tone: inputs.tone,
    category: inputs.category,
    philosophy: inputs.philosophy,
    cta: inputs.cta,
    business: inputs.business,
    variations: inputs.variations,
  })

  return (
    <>
      <Topbar title="Video Script Generator" sub="Turn one idea into a 45–60 second script" />
      <div className="px-8 py-7 max-w-[1620px] w-full mx-auto pb-16">
        <PlatformSwitcher idea={inputs.idea} />
        <div className="grid gap-5" style={{ gridTemplateColumns: "344px 1fr", alignItems: "start" }}>
          <Card className="p-5 sticky top-[88px]">
            <div className="text-[16px] font-semibold mb-4" style={{ color: "var(--text)" }}>Script Inputs</div>
            <InputPanel values={inputs} onChange={set} prefilled={prefilled ?? undefined}
              fields={["idea", "story", "audience", "lesson", "tone", "category", "philosophy", "cta", "business", "variations"]} />
            <Button variant="primary" block loading={isLoading} onClick={handleGenerate} className="mt-1.5">
              {isLoading ? "Generating…" : "Generate Script"}
            </Button>
            {error && <p className="text-[12px] mt-2" style={{ color: "var(--danger)" }}>{error}</p>}
          </Card>

          {isLoading
            ? <GenLoading label="Writing your script…" />
            : !result
              ? <GenEmpty title="Your script will appear here" sub="Fill in the core idea and hit Generate. Output breaks into hook, story, insight, close and production notes." />
              : (
                <div className="fade-seq">
                  <Card className="p-4 mb-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full" style={{ color: "var(--video)", background: "var(--video-bg)" }}>Video</span>
                      <span className="text-[12.5px]" style={{ color: "var(--text-3)" }}>~48 sec · {Object.values(result.sections).join(" ").split(/\s+/).length} words</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => { setResult(null); handleGenerate() }}>Regenerate</Button>
                      <Button size="sm" variant="secondary" onClick={() => showToast("Saved to Content Bank", "ok")}>Save to Bank</Button>
                    </div>
                  </Card>
                  {Object.entries(result.sections).map(([key, body], i) => body && (
                    <div key={key} style={{ animation: `fadeUp .5s ${i * 70}ms backwards` }}>
                      <OutputCard label={SECTION_LABELS[key] || key.toUpperCase()} body={body}
                        mono={["brollIdeas", "recordingDirection", "musicMood"].includes(key)} />
                    </div>
                  ))}
                </div>
              )}
        </div>
      </div>
    </>
  )
}
