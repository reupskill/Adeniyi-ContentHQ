"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Topbar } from "@/components/layout/Topbar"
import { Button, Field, GenLoading, Card, Tabs } from "@/components/ui"
import { useGenerate } from "@/hooks/useGenerate"
import { useAppStore } from "@/store/useAppStore"
import type { ContentRiverOutput } from "@/types"

const PLATFORMS = ["LinkedIn", "Video", "Substack", "X", "Newsletter"]

const PLATFORM_PATHS: Record<string, string> = {
  Video: "/video",
  LinkedIn: "/linkedin",
  X: "/twitter",
  Substack: "/substack",
  Newsletter: "/linkedin",
}

interface RiverSession {
  id: string
  created_at: string
  inputs: { content?: string; platform?: string }
  content_ideas: string[] | null
  video_hooks: string[] | null
  linkedin_angles: string[] | null
  x_post_ideas: string[] | null
  substack_angles: string[] | null
  story_prompts: string[] | null
  philosophical_connections: string[] | null
}

function HistoryView() {
  const [sessions, setSessions] = useState<RiverSession[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const router = useRouter()
  const { showToast } = useAppStore()

  useEffect(() => {
    fetch("/api/generate/daily-inspiration")
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions || []))
      .catch(() => showToast("Failed to load history", "error"))
      .finally(() => setLoading(false))
  }, [])

  const goTo = (path: string, idea: string) => {
    router.push(`${path}?idea=${encodeURIComponent(idea)}`)
  }

  if (loading) return <GenLoading label="Loading your Content River history…" />

  if (!sessions.length) {
    return (
      <div className="text-center py-16">
        <p className="text-[14px] mb-1" style={{ color: "var(--text-2)" }}>No sessions yet</p>
        <p className="text-[13px]" style={{ color: "var(--text-3)" }}>Generate your first Content River session to see it here.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {sessions.map((session) => {
        const isOpen = expanded === session.id
        const date = new Date(session.created_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
        const time = new Date(session.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
        const platform = session.inputs?.platform || "All"
        const firstIdea = session.content_ideas?.[0] || session.story_prompts?.[0] || "No ideas captured"
        const ideaCount = (session.content_ideas?.length || 0) + (session.video_hooks?.length || 0) + (session.linkedin_angles?.length || 0) + (session.x_post_ideas?.length || 0) + (session.substack_angles?.length || 0)

        return (
          <Card key={session.id} className="overflow-hidden">
            <button
              className="w-full text-left p-4 cursor-pointer transition-all"
              style={{ background: "transparent", border: "none", fontFamily: "inherit" }}
              onClick={() => setExpanded(isOpen ? null : session.id)}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>{platform}</span>
                    <span className="text-[11.5px]" style={{ color: "var(--text-faint)" }}>{date} · {time}</span>
                    <span className="text-[11.5px]" style={{ color: "var(--text-3)" }}>{ideaCount} ideas</span>
                  </div>
                  <p className="text-[13px] leading-snug" style={{ color: "var(--text-2)" }}>{firstIdea}</p>
                </div>
                <span className="text-[12px] flex-shrink-0 mt-1" style={{ color: "var(--text-3)" }}>{isOpen ? "▲" : "▼"}</span>
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-[var(--line)] px-4 pb-4 pt-3">
                {session.inputs?.content && (
                  <div className="mb-4 p-3 rounded-xl" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1.5" style={{ color: "var(--text-faint)" }}>Source content</div>
                    <p className="text-[12.5px] leading-relaxed line-clamp-3" style={{ color: "var(--text-3)" }}>{session.inputs.content}</p>
                  </div>
                )}

                {session.content_ideas && session.content_ideas.length > 0 && (
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: "var(--text-3)" }}>Fresh Angles</div>
                    <div className="grid grid-cols-2 gap-2">
                      {session.content_ideas.map((idea, i) => (
                        <div key={i} className="p-2.5 rounded-lg flex items-start gap-2" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                          <span className="font-serif text-[13px] flex-shrink-0 w-5 text-center" style={{ color: "var(--gold)" }}>{i + 1}</span>
                          <p className="text-[12.5px] leading-snug flex-1" style={{ color: "var(--text-2)" }}>{idea}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {session.video_hooks && session.video_hooks.length > 0 && (
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: "var(--text-3)" }}>Video Hooks</div>
                    <div className="flex flex-col gap-1.5">
                      {session.video_hooks.map((hook, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "var(--video)" }} />
                          <p className="text-[12.5px] leading-snug flex-1 mr-2" style={{ color: "var(--text-2)" }}>{hook}</p>
                          <button onClick={() => goTo("/video", hook)}
                            className="flex-shrink-0 text-[10.5px] px-2 py-0.5 rounded border cursor-pointer"
                            style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--video)", color: "var(--video)" }}>
                            Use
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {session.linkedin_angles && session.linkedin_angles.length > 0 && (
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: "var(--text-3)" }}>LinkedIn Angles</div>
                    <div className="flex flex-col gap-1.5">
                      {session.linkedin_angles.map((angle, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "var(--linkedin)" }} />
                          <p className="text-[12.5px] leading-snug flex-1 mr-2" style={{ color: "var(--text-2)" }}>{angle}</p>
                          <button onClick={() => goTo("/linkedin", angle)}
                            className="flex-shrink-0 text-[10.5px] px-2 py-0.5 rounded border cursor-pointer"
                            style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--linkedin)", color: "var(--linkedin)" }}>
                            Write
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {session.x_post_ideas && session.x_post_ideas.length > 0 && (
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: "var(--text-3)" }}>X Post Ideas</div>
                    <div className="flex flex-col gap-1.5">
                      {session.x_post_ideas.map((idea, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "var(--text-3)" }} />
                          <p className="text-[12.5px] leading-snug flex-1 mr-2" style={{ color: "var(--text-2)" }}>{idea}</p>
                          <button onClick={() => goTo("/twitter", idea)}
                            className="flex-shrink-0 text-[10.5px] px-2 py-0.5 rounded border cursor-pointer"
                            style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--text-3)", color: "var(--text-3)" }}>
                            Write
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {session.substack_angles && session.substack_angles.length > 0 && (
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: "var(--text-3)" }}>Substack Angles</div>
                    <div className="flex flex-col gap-1.5">
                      {session.substack_angles.map((angle, i) => (
                        <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "var(--substack)" }} />
                          <p className="text-[12.5px] leading-snug flex-1 mr-2" style={{ color: "var(--text-2)" }}>{angle}</p>
                          <button onClick={() => goTo("/substack", angle)}
                            className="flex-shrink-0 text-[10.5px] px-2 py-0.5 rounded border cursor-pointer"
                            style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--substack)", color: "var(--substack)" }}>
                            Write
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {session.story_prompts && session.story_prompts.length > 0 && (
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: "var(--text-3)" }}>Pull Quotes</div>
                    <div className="flex flex-col gap-1.5">
                      {session.story_prompts.map((quote, i) => (
                        <div key={i} className="p-2.5 rounded-lg" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                          <p className="text-[12.5px] leading-snug font-serif" style={{ color: "var(--cream)" }}>&ldquo;{quote}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

export default function ContentRiverPage() {
  const [activeTab, setActiveTab] = useState("Generate")
  const [content, setContent] = useState("")
  const [platform, setPlatform] = useState("LinkedIn")
  const [output, setOutput] = useState<ContentRiverOutput | null>(null)
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const { showToast } = useAppStore()
  const router = useRouter()

  const { generate, isLoading, error } = useGenerate({
    endpoint: "/api/generate/daily-inspiration",
    onSuccess: (data) => {
      setOutput(data as ContentRiverOutput)
      setSaved({})
      showToast("Ideas generated", "ok")
    },
    onError: (e) => showToast(e, "error"),
  })

  const goTo = (path: string, idea: string) => {
    router.push(`${path}?idea=${encodeURIComponent(idea)}`)
  }

  const saveToBank = async (key: string, title: string, plat: string) => {
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
          platform: plat,
          category: PLATFORM_CATEGORY[plat] || "Leadership",
          status: "Idea",
          content: title,
          raw_inputs: { source: "content-river" },
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

  function SaveBtn({ id, label, plat }: { id: string; label: string; plat: string }) {
    const isSaved = saved[id]
    const isSaving = saving[id]
    return (
      <button
        onClick={(e) => { e.stopPropagation(); saveToBank(id, label, plat) }}
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
      <Topbar title="Content River" sub="One piece of writing. Endless ideas." />
      <div className="px-8 py-7 max-w-[1100px] w-full mx-auto pb-16">

        <div className="flex items-center justify-between mb-6">
          <div className="text-center flex-1">
            <h1 className="font-serif text-[30px]" style={{ color: "var(--text)" }}>Mine your existing writing for ideas</h1>
            <p className="text-[14.5px] mt-3 leading-relaxed" style={{ color: "var(--text-2)" }}>
              Paste a piece you&apos;ve already written. Get fresh angles, new takes, related topics, and platform-ready ideas.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <Tabs options={["Generate", "History"]} value={activeTab} onChange={setActiveTab} />
        </div>

        {activeTab === "History" ? (
          <HistoryView />
        ) : (
          <>
            <Card className="p-5 mb-6">
              <div className="mb-4">
                <p className="text-[13px] font-semibold mb-2" style={{ color: "var(--text-2)" }}>Original platform</p>
                <div className="flex gap-2 flex-wrap">
                  {PLATFORMS.map((p) => (
                    <button key={p} onClick={() => setPlatform(p)}
                      className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium border cursor-pointer transition-all"
                      style={{
                        background: platform === p ? "var(--gold-dim)" : "var(--surface-2)",
                        borderColor: platform === p ? "var(--gold-line)" : "var(--line-2)",
                        color: platform === p ? "var(--gold)" : "var(--text-2)",
                        fontFamily: "inherit",
                      }}>{p}</button>
                  ))}
                </div>
              </div>

              <Field label="Paste your content">
                <textarea
                  className="w-full rounded-xl text-[14px] leading-relaxed resize-none outline-none px-4 py-3"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--line-2)",
                    color: "var(--text)",
                    minHeight: 220,
                    fontFamily: "inherit",
                  }}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste a LinkedIn post, essay, video script, newsletter, or any piece you've written. The AI will find every angle, idea, and thread worth pulling on…"
                />
              </Field>

              <Button variant="primary" block loading={isLoading} className="mt-1"
                disabled={!content.trim()}
                onClick={() => generate({ content, platform })}>
                {isLoading ? "Mining for ideas…" : "Generate Ideas from This Content"}
              </Button>
              {error && <p className="text-[12px] mt-2" style={{ color: "var(--danger)" }}>{error}</p>}
            </Card>

            {isLoading && <GenLoading label="Finding every thread worth pulling on…" />}

            {output && !isLoading && (
              <div className="fade-seq">

                {/* Fresh Angles */}
                <Card className="p-5 mb-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>10 Fresh Angles</span>
                      <p className="text-[12px] mt-0.5" style={{ color: "var(--text-3)" }}>New ways to approach the same core theme — each one a complete new piece</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>{output.freshAngles.length}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {output.freshAngles.map((angle, i) => (
                      <div key={i}
                        className="flex items-start gap-3 p-3.5 rounded-xl"
                        style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                        <span className="font-serif text-[18px] flex-shrink-0 w-7 text-center mt-0.5" style={{ color: "var(--gold)" }}>{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13.5px] leading-snug mb-2.5" style={{ color: "var(--text)" }}>{angle}</p>
                          <div className="flex gap-1.5 flex-wrap">
                            <button onClick={() => goTo("/linkedin", angle)}
                              className="text-[11px] px-2 py-1 rounded-md border cursor-pointer transition-all"
                              style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--linkedin)", color: "var(--linkedin)" }}>
                              LinkedIn
                            </button>
                            <button onClick={() => goTo("/video", angle)}
                              className="text-[11px] px-2 py-1 rounded-md border cursor-pointer transition-all"
                              style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--video)", color: "var(--video)" }}>
                              Video
                            </button>
                            <button onClick={() => goTo("/substack", angle)}
                              className="text-[11px] px-2 py-1 rounded-md border cursor-pointer transition-all"
                              style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--substack)", color: "var(--substack)" }}>
                              Substack
                            </button>
                            <SaveBtn id={`angle-${i}`} label={angle} plat={platform} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-5">

                  {/* Pull Quotes */}
                  <Card className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>5 Pull Quotes</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>5</span>
                    </div>
                    <p className="text-[12px] mb-4" style={{ color: "var(--text-3)" }}>Standalone lines that could work as posts on their own</p>
                    {output.pullQuotes.map((quote, i) => (
                      <div key={i} className="py-3 border-b border-[var(--line)] last:border-b-0">
                        <p className="text-[14px] leading-relaxed mb-2 font-serif" style={{ color: "var(--cream)" }}>&ldquo;{quote}&rdquo;</p>
                        <div className="flex gap-2">
                          <button onClick={() => goTo("/twitter", quote)}
                            className="text-[11px] px-2 py-0.5 rounded border cursor-pointer"
                            style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--text-3)", color: "var(--text-3)" }}>
                            Post on X
                          </button>
                          <button onClick={() => goTo("/linkedin", quote)}
                            className="text-[11px] px-2 py-0.5 rounded border cursor-pointer"
                            style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--linkedin)", color: "var(--linkedin)" }}>
                            LinkedIn
                          </button>
                          <SaveBtn id={`quote-${i}`} label={quote} plat="X" />
                        </div>
                      </div>
                    ))}
                  </Card>

                  {/* Video Hooks */}
                  <Card className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>5 Video Hooks</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>5</span>
                    </div>
                    <p className="text-[12px] mb-4" style={{ color: "var(--text-3)" }}>Hooks for videos on this theme</p>
                    {output.videoHooks.map((hook, i) => (
                      <div key={i} className="py-3 border-b border-[var(--line)] last:border-b-0">
                        <p className="text-[14px] leading-relaxed mb-2" style={{ color: "var(--cream)" }}>&ldquo;{hook}&rdquo;</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => goTo("/video", hook)}>Use in Video</Button>
                          <SaveBtn id={`hook-${i}`} label={hook} plat="Video" />
                        </div>
                      </div>
                    ))}
                  </Card>

                  {/* LinkedIn Angles */}
                  <Card className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>5 LinkedIn Angles</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>5</span>
                    </div>
                    <p className="text-[12px] mb-4" style={{ color: "var(--text-3)" }}>Post angles derived from this content</p>
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
                            <SaveBtn id={`li-${i}`} label={angle} plat="LinkedIn" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card>

                  {/* X Post Ideas */}
                  <Card className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>5 X Post Ideas</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>5</span>
                    </div>
                    <p className="text-[12px] mb-4" style={{ color: "var(--text-3)" }}>Short, punchy takes inspired by this content</p>
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
                            <SaveBtn id={`x-${i}`} label={idea} plat="X" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card>

                  {/* Substack Angles */}
                  <Card className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>3 Substack Essay Angles</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>3</span>
                    </div>
                    <p className="text-[12px] mb-4" style={{ color: "var(--text-3)" }}>Deeper ideas worth expanding into full essays</p>
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
                            <SaveBtn id={`ss-${i}`} label={angle} plat="Substack" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card>

                  {/* Related Topics */}
                  <Card className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>3 Related Topics</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>3</span>
                    </div>
                    <p className="text-[12px] mb-4" style={{ color: "var(--text-3)" }}>Adjacent ideas this content touches on — worth their own pieces</p>
                    {output.relatedTopics.map((topic, i) => (
                      <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-[var(--line)] last:border-b-0">
                        <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--gold)" }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13.5px] leading-relaxed mb-1.5" style={{ color: "var(--text-2)" }}>{topic}</p>
                          <div className="flex gap-1.5">
                            <button onClick={() => goTo("/linkedin", topic)}
                              className="text-[11px] px-2 py-0.5 rounded border cursor-pointer"
                              style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--linkedin)", color: "var(--linkedin)" }}>
                              LinkedIn
                            </button>
                            <button onClick={() => goTo("/substack", topic)}
                              className="text-[11px] px-2 py-0.5 rounded border cursor-pointer"
                              style={{ fontFamily: "inherit", background: "transparent", borderColor: "var(--substack)", color: "var(--substack)" }}>
                              Substack
                            </button>
                            <SaveBtn id={`rel-${i}`} label={topic} plat={platform} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card>

                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
