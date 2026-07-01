"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Topbar } from "@/components/layout/Topbar"
import { Button, Field, Input, GenLoading, Card } from "@/components/ui"
import { useGenerate } from "@/hooks/useGenerate"
import { useAppStore } from "@/store/useAppStore"
import type { DailyInspirationOutput } from "@/types"

const FIELDS: [string, string, string][] = [
  ["recentTheme", "Recent Theme", "A thread running through your week"],
  ["recentEvent", "Recent Event", "Something that actually happened"],
  ["frustration", "A Frustration", "What's been grinding on you"],
  ["mistake", "A Mistake", "A recent misstep & what it taught"],
  ["belief", "A Belief", "Something you hold strongly"],
  ["lesson", "A Lesson", "Hard-won wisdom"],
  ["question", "A Question", "Something you're sitting with"],
  ["onlineDisagreement", "An Online Disagreement", "A take you pushed back on"],
  ["buildingLesson", "Lesson from Building", "From the work itself"],
  ["currentStruggle", "Current Struggle", "What's genuinely hard right now"],
]

const PLATFORM_PATHS: Record<string, string> = {
  Video: "/video",
  LinkedIn: "/linkedin",
  X: "/twitter",
  Substack: "/substack",
  Newsletter: "/linkedin",
}

export default function DailyPage() {
  const [vals, setVals] = useState<Record<string, string>>({})
  const [output, setOutput] = useState<DailyInspirationOutput | null>(null)
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const { showToast } = useAppStore()
  const router = useRouter()
  const { generate, isLoading, error } = useGenerate({
    endpoint: "/api/generate/daily-inspiration",
    onSuccess: (data) => {
      setOutput(data as DailyInspirationOutput)
      setSaved({})
      showToast("Content ideas generated", "ok")
    },
    onError: (e) => showToast(e, "error"),
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setVals((v) => ({ ...v, [k]: e.target.value }))

  const goTo = (path: string, idea: string) => {
    router.push(`${path}?idea=${encodeURIComponent(idea)}`)
  }

  const saveToBank = async (key: string, title: string, platform: string) => {
    if (saved[key]) return
    setSaving((s) => ({ ...s, [key]: true }))
    try {
      const PLATFORM_CATEGORY: Record<string, string> = {
        Video: "Mindset", LinkedIn: "Leadership", X: "Leadership",
        Substack: "Philosophy", Newsletter: "Leadership",
      }
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.slice(0, 120),
          platform,
          category: PLATFORM_CATEGORY[platform] || "Leadership",
          status: "Idea",
          content: title,
          raw_inputs: { source: "daily-inspiration" },
        }),
      })
      if (res.ok) {
        showToast("Saved to Content Bank", "ok")
        setSaved((s) => ({ ...s, [key]: true }))
      } else {
        showToast("Failed to save", "error")
      }
    } catch {
      showToast("Failed to save", "error")
    } finally {
      setSaving((s) => ({ ...s, [key]: false }))
    }
  }

  function SaveBtn({ id, label, platform }: { id: string; label: string; platform: string }) {
    const isSaved = saved[id]
    const isSaving = saving[id]
    return (
      <button
        onClick={(e) => { e.stopPropagation(); saveToBank(id, label, platform) }}
        disabled={isSaved || isSaving}
        className="flex-shrink-0 text-[11px] px-2 py-1 rounded-md border cursor-pointer transition-all"
        style={{
          fontFamily: "inherit",
          background: isSaved ? "var(--gold-dim)" : "var(--surface-2)",
          borderColor: isSaved ? "var(--gold-line)" : "var(--line-2)",
          color: isSaved ? "var(--gold)" : "var(--text-3)",
          opacity: isSaving ? 0.6 : 1,
        }}>
        {isSaved ? "Saved ✓" : isSaving ? "…" : "+ Save"}
      </button>
    )
  }

  return (
    <>
      <Topbar title="Daily Inspiration" sub="A day of life — a week of content" />
      <div className="px-8 py-7 max-w-[1100px] w-full mx-auto pb-16">
        <div className="text-center max-w-[620px] mx-auto mb-8">
          <h1 className="font-serif text-[30px]" style={{ color: "var(--text)" }}>What&apos;s happening in your world today?</h1>
          <p className="text-[14.5px] mt-3 leading-relaxed" style={{ color: "var(--text-2)" }}>
            Real content comes from real life. Drop in what you&apos;re thinking, feeling, and wrestling with — turn a single day into a week of ideas.
          </p>
        </div>

        <Card className="p-5 mb-6">
          <div className="grid grid-cols-2 gap-x-5">
            {FIELDS.map(([k, label, ph]) => (
              <Field key={k} label={label}>
                <Input value={vals[k] || ""} onChange={set(k)} placeholder={ph} />
              </Field>
            ))}
          </div>
          <Button variant="primary" block loading={isLoading} className="mt-2"
            onClick={() => generate(vals)}>
            {isLoading ? "Generating a day of ideas…" : "Generate Content Ideas"}
          </Button>
          {error && <p className="text-[12px] mt-2" style={{ color: "var(--danger)" }}>{error}</p>}
        </Card>

        {isLoading && <GenLoading label="Mining your inputs for ideas…" />}

        {output && !isLoading && (
          <div className="fade-seq">
            {/* Content Ideas */}
            <Card className="p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>10 Daily Content Ideas</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>{output.contentIdeas.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {output.contentIdeas.map((idea, i) => (
                  <div key={i}
                    className="flex items-start gap-3 p-3.5 rounded-xl"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                    <span className="font-serif text-[18px] flex-shrink-0 w-7 text-center mt-0.5" style={{ color: "var(--gold)" }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] leading-snug mb-2.5" style={{ color: "var(--text)" }}>{idea}</p>
                      <div className="flex gap-1.5 flex-wrap">
                        <button
                          onClick={() => goTo("/video", idea)}
                          className="text-[11px] px-2 py-1 rounded-md border cursor-pointer transition-all"
                          style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--video)", color: "var(--video)" }}>
                          Video
                        </button>
                        <button
                          onClick={() => goTo("/linkedin", idea)}
                          className="text-[11px] px-2 py-1 rounded-md border cursor-pointer transition-all"
                          style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--linkedin)", color: "var(--linkedin)" }}>
                          LinkedIn
                        </button>
                        <button
                          onClick={() => goTo("/substack", idea)}
                          className="text-[11px] px-2 py-1 rounded-md border cursor-pointer transition-all"
                          style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--substack)", color: "var(--substack)" }}>
                          Substack
                        </button>
                        <SaveBtn id={`idea-${i}`} label={idea} platform="Video" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-5">
              {/* Video Hooks */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>5 Video Hooks</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>5</span>
                </div>
                {output.videoHooks.map((hook, i) => (
                  <div key={i} className="py-3 border-b border-[var(--line)] last:border-b-0">
                    <p className="text-[14px] leading-relaxed mb-2" style={{ color: "var(--cream)" }}>&ldquo;{hook}&rdquo;</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => goTo("/video", hook)}>Use in Video</Button>
                      <SaveBtn id={`hook-${i}`} label={hook} platform="Video" />
                    </div>
                  </div>
                ))}
              </Card>

              {/* LinkedIn Angles */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>5 LinkedIn Angles</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>5</span>
                </div>
                {output.linkedinAngles.map((angle, i) => (
                  <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-[var(--line)] last:border-b-0">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--gold)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] leading-relaxed mb-1.5" style={{ color: "var(--text-2)" }}>{angle}</p>
                      <div className="flex gap-1.5">
                        <button onClick={() => goTo("/linkedin", angle)}
                          className="text-[11px] px-2 py-0.5 rounded border cursor-pointer"
                          style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--linkedin)", color: "var(--linkedin)" }}>
                          Write it
                        </button>
                        <SaveBtn id={`li-${i}`} label={angle} platform="LinkedIn" />
                      </div>
                    </div>
                  </div>
                ))}
              </Card>

              {/* X Post Ideas */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>5 X Post Ideas</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>5</span>
                </div>
                {output.xPostIdeas.map((idea, i) => (
                  <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-[var(--line)] last:border-b-0">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--gold)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] leading-relaxed mb-1.5" style={{ color: "var(--text-2)" }}>{idea}</p>
                      <div className="flex gap-1.5">
                        <button onClick={() => goTo("/twitter", idea)}
                          className="text-[11px] px-2 py-0.5 rounded border cursor-pointer"
                          style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--text-3)", color: "var(--text-3)" }}>
                          Write it
                        </button>
                        <SaveBtn id={`x-${i}`} label={idea} platform="X" />
                      </div>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Substack Angles */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>3 Substack Essay Angles</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>3</span>
                </div>
                {output.substackAngles.map((angle, i) => (
                  <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-[var(--line)] last:border-b-0">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--gold)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] leading-relaxed mb-1.5" style={{ color: "var(--text-2)" }}>{angle}</p>
                      <div className="flex gap-1.5">
                        <button onClick={() => goTo("/substack", angle)}
                          className="text-[11px] px-2 py-0.5 rounded border cursor-pointer"
                          style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--substack)", color: "var(--substack)" }}>
                          Write it
                        </button>
                        <SaveBtn id={`ss-${i}`} label={angle} platform="Substack" />
                      </div>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Story Prompts */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>3 Personal Story Prompts</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>3</span>
                </div>
                {output.storyPrompts.map((prompt, i) => (
                  <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-[var(--line)] last:border-b-0">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--gold)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] leading-relaxed mb-1.5" style={{ color: "var(--text-2)" }}>{prompt}</p>
                      <div className="flex gap-1.5">
                        <button onClick={() => goTo("/video", prompt)}
                          className="text-[11px] px-2 py-0.5 rounded border cursor-pointer"
                          style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--video)", color: "var(--video)" }}>
                          Write it
                        </button>
                        <SaveBtn id={`story-${i}`} label={prompt} platform="Video" />
                      </div>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Philosophical Connections */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>3 Philosophical Connections</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>3</span>
                </div>
                {output.philosophicalConnections.map((conn, i) => (
                  <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-[var(--line)] last:border-b-0">
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--gold)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] leading-relaxed mb-1.5" style={{ color: "var(--text-2)" }}>{conn}</p>
                      <div className="flex gap-1.5">
                        <button onClick={() => goTo("/substack", conn)}
                          className="text-[11px] px-2 py-0.5 rounded border cursor-pointer"
                          style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--substack)", color: "var(--substack)" }}>
                          Write it
                        </button>
                        <SaveBtn id={`phil-${i}`} label={conn} platform="Substack" />
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Business Metaphors */}
            <Card className="p-5 mt-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>3 Business Metaphors</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>3</span>
              </div>
              {output.businessMetaphors.map((metaphor, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-[var(--line)] last:border-b-0">
                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--gold)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] leading-relaxed mb-1.5" style={{ color: "var(--text-2)" }}>{metaphor}</p>
                    <div className="flex gap-1.5">
                      <button onClick={() => goTo("/linkedin", metaphor)}
                        className="text-[11px] px-2 py-0.5 rounded border cursor-pointer"
                        style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--linkedin)", color: "var(--linkedin)" }}>
                        Write it
                      </button>
                      <SaveBtn id={`meta-${i}`} label={metaphor} platform="LinkedIn" />
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>
    </>
  )
}
