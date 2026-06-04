"use client"
import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { InputPanel, GeneratorInputs } from "@/components/generators/InputPanel"
import { PlatformSwitcher } from "@/components/generators/PlatformSwitcher"
import { Button, Tabs, GenLoading, GenEmpty, Card } from "@/components/ui"
import { useGenerate } from "@/hooks/useGenerate"
import { useGeneratorInit } from "@/hooks/useGeneratorInit"
import { useAppStore } from "@/store/useAppStore"

const FORMATS = ["One-liner", "3-Tweet Thread", "5-Tweet Thread", "Founder Lesson", "Growth Lesson"]
const FORMAT_MAP: Record<string, string> = {
  "One-liner": "one-liner",
  "3-Tweet Thread": "3-thread",
  "5-Tweet Thread": "5-thread",
  "Founder Lesson": "founder",
  "Growth Lesson": "growth",
}

export default function TwitterPage() {
  const { inputs, setInputs, prefilled } = useGeneratorInit("twitter")
  const [format, setFormat] = useState("3-Tweet Thread")
  const [tweets, setTweets] = useState<string[]>([])
  const { showToast } = useAppStore()
  const { generate, isLoading, error } = useGenerate({
    endpoint: "/api/generate/twitter",
    onSuccess: (data: any) => {
      setTweets(data.tweets || [data.raw])
      showToast("Tweets generated", "ok")
    },
    onError: (e) => showToast(e, "error"),
  })

  const set = (k: keyof GeneratorInputs, v: string | number) => setInputs((p) => ({ ...p, [k]: v }))
  const isThread = tweets.length > 1

  return (
    <>
      <Topbar title="X / Twitter Generator" sub="Sharp threads and one-liners" />
      <div className="px-8 py-7 max-w-[1620px] w-full mx-auto pb-16">
        <PlatformSwitcher idea={inputs.idea} />
        <div className="mb-4">
          <Tabs options={FORMATS} value={format} onChange={setFormat} />
        </div>
        <div className="grid gap-5" style={{ gridTemplateColumns: "344px 1fr", alignItems: "start" }}>
          <Card className="p-5 sticky top-[88px]">
            <div className="text-[16px] font-semibold mb-4" style={{ color: "var(--text)" }}>Tweet Inputs</div>
            <InputPanel values={inputs} onChange={set} prefilled={prefilled ?? undefined}
              fields={["idea", "story", "tone", "category", "philosophy", "cta"]} />
            <Button variant="primary" block loading={isLoading} className="mt-1.5"
              onClick={() => generate({ ...inputs, format: FORMAT_MAP[format] })}>
              {isLoading ? "Generating…" : "Generate Tweets"}
            </Button>
            {error && <p className="text-[12px] mt-2" style={{ color: "var(--danger)" }}>{error}</p>}
          </Card>

          <div>
            {isLoading ? <GenLoading label="Writing your tweets…" /> : !tweets.length
              ? <GenEmpty title="Your tweets will appear here" sub="Choose a format above, fill in the idea, and hit Generate." />
              : (
                <div className="fade-seq flex flex-col gap-3">
                  {tweets.map((tweet, i) => (
                    <div key={i}>
                      {isThread && i > 0 && (
                        <div className="flex justify-center my-1">
                          <div className="w-0.5 h-5 rounded-full" style={{ background: "var(--line-2)" }} />
                        </div>
                      )}
                      <Card className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full grid place-items-center font-semibold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #2e2740, #1a1626)", color: "var(--gold)", border: "1px solid var(--line-2)" }}>A</div>
                          <div className="flex-1 min-w-0">
                            {isThread && <div className="text-[11px] font-semibold mb-1.5" style={{ color: "var(--text-3)" }}>Tweet {i + 1}</div>}
                            <p className="text-[14px] leading-relaxed" style={{ color: "var(--cream)" }}>{tweet}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--line)]">
                          <span className="text-[12px]" style={{ color: tweet.length > 260 ? "var(--danger)" : "var(--text-3)" }}>
                            {tweet.length}/280
                          </span>
                          <button onClick={() => navigator.clipboard.writeText(tweet).then(() => showToast("Copied!", "ok"))}
                            className="text-[11.5px] px-2 py-1 rounded-md border cursor-pointer transition-colors"
                            style={{ color: "var(--text-3)", background: "transparent", borderColor: "var(--line)", fontFamily: "inherit" }}>
                            Copy
                          </button>
                        </div>
                      </Card>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="ghost" onClick={() => generate({ ...inputs, format: FORMAT_MAP[format] })}>Regenerate</Button>
                    <Button size="sm" variant="secondary" onClick={() => showToast("Saved to Content Bank", "ok")}>Save to Bank</Button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  )
}
