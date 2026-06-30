"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Button, Card, Tabs } from "@/components/ui"
import { useAppStore } from "@/store/useAppStore"

const PLATFORMS = ["LinkedIn", "Newsletter", "Video", "Substack", "X"]

interface TrainingItem {
  id: string
  title: string
  platform: string
  category: string
  content: string
  created_at: string
  metadata?: { isTrainingExample?: boolean; addedAt?: string }
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "var(--gold)" : "none"}
      stroke="var(--gold)" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState("My Examples")
  const { showToast } = useAppStore()

  // Add example state
  const [inputMode, setInputMode] = useState<"text" | "screenshot">("text")
  const [text, setText] = useState("")
  const [notes, setNotes] = useState("")
  const [platform, setPlatform] = useState("LinkedIn")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Examples list state
  const [examples, setExamples] = useState<TrainingItem[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const loadExamples = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/training")
      const data = await res.json()
      setExamples(data.items || [])
    } catch { showToast("Failed to load examples", "error") }
    finally { setLoading(false) }
  }, [showToast])

  useEffect(() => {
    if (activeTab === "My Examples") loadExamples()
  }, [activeTab, loadExamples])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setImagePreview(result)
      // Strip the data:image/...;base64, prefix for the API
      setImageBase64(result.split(",")[1])
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const handleSave = async () => {
    if (inputMode === "text" && !text.trim()) { showToast("Paste your content first", "error"); return }
    if (inputMode === "screenshot" && !imageBase64) { showToast("Upload a screenshot first", "error"); return }
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch("/api/training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputMode === "text" ? text : undefined,
          imageBase64: inputMode === "screenshot" ? imageBase64 : undefined,
          imageDataUrl: inputMode === "screenshot" ? imagePreview : undefined,
          platform,
          notes,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = data.error || "Failed to save"
        setSaveError(msg)
        return
      }
      showToast("Saved as training example", "ok")
      setSaveError(null)
      setText(""); setNotes(""); setImagePreview(null); setImageBase64(null)
      if (activeTab === "My Examples") loadExamples()
    } catch (e: any) {
      setSaveError(e?.message || "Network error — could not reach server")
    }
    finally { setSaving(false) }
  }

  const handleUnmark = async (id: string) => {
    try {
      const item = examples.find(e => e.id === id)
      const res = await fetch(`/api/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metadata: { ...item?.metadata, isTrainingExample: false } }),
      })
      if (res.ok) { showToast("Removed from training examples", "ok"); loadExamples() }
      else showToast("Failed to remove", "error")
    } catch { showToast("Failed to remove", "error") }
  }

  return (
    <>
      <Topbar title="Training Examples" sub="Teach the AI your voice and style" />
      <div className="px-8 py-7 max-w-[900px] w-full mx-auto pb-16">

        {/* Intro */}
        <Card className="p-5 mb-6" style={{ borderLeft: "3px solid var(--gold)", borderRadius: "0 12px 12px 0" }}>
          <p className="text-[14px] font-semibold mb-1" style={{ color: "var(--text)" }}>How this works</p>
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-3)" }}>
            Add writing examples you like — paste text or upload screenshots of content you've published.
            You can also star any piece in your Content Bank. These examples train the AI to write more like you,
            matching your voice, rhythm, and style in all future generated content.
          </p>
        </Card>

        <div className="mb-6">
          <Tabs options={["My Examples", "Add Example"]} value={activeTab} onChange={setActiveTab} />
        </div>

        {/* ── My Examples ── */}
        {activeTab === "My Examples" && (
          <div>
            {loading ? (
              <div className="text-center py-12" style={{ color: "var(--text-3)" }}>Loading…</div>
            ) : examples.length === 0 ? (
              <Card>
                <div className="text-center py-16 px-8">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl grid place-items-center"
                    style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-line)" }}>
                    <StarIcon filled={true} />
                  </div>
                  <p className="font-serif text-[19px] mb-2" style={{ color: "var(--text)" }}>No training examples yet</p>
                  <p className="text-[13px] mb-5" style={{ color: "var(--text-3)" }}>
                    Add examples of content you've written, or star pieces in your Content Bank to mark them as style references.
                  </p>
                  <Button variant="primary" onClick={() => setActiveTab("Add Example")}>Add your first example</Button>
                </div>
              </Card>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-[12.5px] mb-1" style={{ color: "var(--text-3)" }}>{examples.length} example{examples.length !== 1 ? "s" : ""} in your training set</p>
                {examples.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: "var(--gold-dim)", color: "var(--gold)" }}>{item.platform}</span>
                          <span className="text-[11px]" style={{ color: "var(--text-3)" }}>
                            {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        <p className="text-[13.5px] font-medium mb-1" style={{ color: "var(--text)" }}>{item.title}</p>
                        <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                          {expandedId === item.id ? item.content : item.content.slice(0, 180) + (item.content.length > 180 ? "…" : "")}
                        </p>
                        {item.content.length > 180 && (
                          <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                            className="text-[12px] mt-1 cursor-pointer bg-transparent border-none"
                            style={{ color: "var(--gold)", fontFamily: "inherit" }}>
                            {expandedId === item.id ? "Show less" : "Show full content"}
                          </button>
                        )}
                      </div>
                      <button onClick={() => handleUnmark(item.id)}
                        className="flex-shrink-0 p-1.5 rounded-md cursor-pointer border transition-all"
                        style={{ background: "var(--gold-dim)", borderColor: "var(--gold-line)" }}
                        title="Remove from training">
                        <StarIcon filled={true} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Add Example ── */}
        {activeTab === "Add Example" && (
          <div>
            <Card className="p-5 mb-4">
              <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--text)" }}>Platform</p>
              <p className="text-[12.5px] mb-3" style={{ color: "var(--text-3)" }}>Which platform is this content from?</p>
              <div className="flex gap-2 flex-wrap mb-5">
                {PLATFORMS.map((p) => (
                  <button key={p} onClick={() => setPlatform(p)}
                    className="px-3 py-1.5 rounded-lg text-[13px] font-medium border cursor-pointer transition-all"
                    style={{
                      background: platform === p ? "var(--gold-dim)" : "var(--surface-2)",
                      borderColor: platform === p ? "var(--gold-line)" : "var(--line-2)",
                      color: platform === p ? "var(--gold)" : "var(--text-2)",
                      fontFamily: "inherit",
                    }}>{p}</button>
                ))}
              </div>

              <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--text)" }}>Input method</p>
              <div className="flex gap-2 mb-5">
                {(["text", "screenshot"] as const).map((mode) => (
                  <button key={mode} onClick={() => { setInputMode(mode); setImagePreview(null); setImageBase64(null); setText("") }}
                    className="px-3.5 py-2 rounded-lg text-[13px] font-medium border cursor-pointer transition-all"
                    style={{
                      background: inputMode === mode ? "var(--surface-3, var(--surface-2))" : "var(--surface-2)",
                      borderColor: inputMode === mode ? "var(--text-3)" : "var(--line-2)",
                      color: inputMode === mode ? "var(--text)" : "var(--text-2)",
                      fontFamily: "inherit",
                    }}>
                    {mode === "text" ? "Paste text" : "Upload screenshot"}
                  </button>
                ))}
              </div>

              {inputMode === "text" ? (
                <div>
                  <p className="text-[12.5px] mb-2" style={{ color: "var(--text-3)" }}>Paste content you've written — a post, essay, thread, or script</p>
                  <textarea
                    className="w-full rounded-xl text-[14px] leading-relaxed resize-none outline-none px-4 py-3 mb-4"
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--line-2)",
                      color: "var(--text)",
                      minHeight: 200,
                      fontFamily: "inherit",
                    }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your written content here — the more you add, the more accurately the AI learns your voice…"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-[12.5px] mb-3" style={{ color: "var(--text-3)" }}>Upload a screenshot of content you've written. The AI will extract and save the text.</p>
                  {imagePreview ? (
                    <div className="mb-4">
                      <img src={imagePreview} alt="Screenshot preview" className="rounded-xl max-h-[300px] w-auto" style={{ border: "1px solid var(--line-2)" }} />
                      <button onClick={() => { setImagePreview(null); setImageBase64(null) }}
                        className="mt-2 text-[12px] cursor-pointer bg-transparent border-none"
                        style={{ color: "var(--danger)", fontFamily: "inherit" }}>Remove</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-full rounded-xl border-2 border-dashed py-12 cursor-pointer transition-all mb-4"
                      style={{ borderColor: "var(--line-2)", background: "var(--surface-2)" }}>
                      <div className="text-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5" className="mx-auto mb-2">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <p className="text-[13px]" style={{ color: "var(--text-3)" }}>Click to upload screenshot</p>
                        <p className="text-[11.5px] mt-0.5" style={{ color: "var(--text-faint)" }}>JPG, PNG, WEBP</p>
                      </div>
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
              )}

              <div className="mb-5">
                <p className="text-[12.5px] mb-1.5" style={{ color: "var(--text-3)" }}>Label (optional) — helps you find it later</p>
                <input
                  className="w-full rounded-xl text-[14px] outline-none px-4 py-2.5"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--line-2)", color: "var(--text)", fontFamily: "inherit" }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. LinkedIn post on trust, June 2025"
                />
              </div>

              {saveError && (
                <div className="mb-3 px-3 py-2.5 rounded-xl text-[12.5px] leading-relaxed"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
                  <strong>Error:</strong> {saveError}
                </div>
              )}
              <Button variant="primary" loading={saving} onClick={handleSave}
                disabled={(inputMode === "text" && !text.trim()) || (inputMode === "screenshot" && !imageBase64)}>
                {saving ? (inputMode === "screenshot" ? "Extracting text…" : "Saving…") : "Save as Training Example"}
              </Button>
            </Card>

            <div className="p-4 rounded-xl text-[12.5px] leading-relaxed" style={{ background: "var(--surface-2)", color: "var(--text-3)" }}>
              <strong style={{ color: "var(--text-2)" }}>Tip:</strong> You can also star any piece in your{" "}
              <a href="/bank" style={{ color: "var(--gold)" }}>Content Bank</a>{" "}
              to add it to your training set. Aim for 10+ diverse examples for the best results.
            </div>
          </div>
        )}
      </div>
    </>
  )
}
