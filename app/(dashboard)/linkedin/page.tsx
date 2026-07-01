"use client"
import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { InputPanel, GeneratorInputs } from "@/components/generators/InputPanel"
import { PlatformSwitcher } from "@/components/generators/PlatformSwitcher"
import { Button, Tabs, GenLoading, GenEmpty, Card } from "@/components/ui"
import { useGenerate } from "@/hooks/useGenerate"
import { useGeneratorInit } from "@/hooks/useGeneratorInit"
import { useAppStore } from "@/store/useAppStore"

function useSaveAsExample(showToast: (msg: string, type: "ok" | "error") => void) {
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  const saveAsExample = async (id: string) => {
    if (saved.has(id) || !id) return
    setSaving(true)
    try {
      const res = await fetch(`/api/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metadata: { isTrainingExample: true, addedAt: new Date().toISOString() } }),
      })
      if (res.ok) { setSaved((s) => { const n = new Set(s); n.add(id); return n }); showToast("Saved as training example", "ok") }
      else showToast("Failed to save as example", "error")
    } catch { showToast("Failed to save as example", "error") }
    finally { setSaving(false) }
  }

  return { saveAsExample, saved, saving }
}

export default function LinkedInPage() {
  const { inputs, setInputs, prefilled } = useGeneratorInit("linkedin")
  const [posts, setPosts] = useState<string[]>([])
  const [postIds, setPostIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("Variation 1")
  const { showToast } = useAppStore()
  const { saveAsExample, saved: exSaved, saving: exSaving } = useSaveAsExample(showToast)
  const { generate, isLoading, error } = useGenerate({
    endpoint: "/api/generate/linkedin",
    onSuccess: (data: any) => {
      setPosts(data.posts || [data.raw])
      setPostIds(data.ids || [])
      setActiveTab("Variation 1")
      showToast("LinkedIn post generated", "ok")
    },
    onError: (e) => showToast(e, "error"),
  })

  const set = (k: keyof GeneratorInputs, v: string | number) => setInputs((p) => ({ ...p, [k]: v }))
  const activeIndex = parseInt(activeTab.split(" ")[1]) - 1
  const activePost = posts[activeIndex] || ""
  const activeId = postIds[activeIndex] || ""

  return (
    <>
      <Topbar title="LinkedIn Post Generator" sub="Reflective posts that build influence" />
      <div className="px-8 py-7 max-w-[1620px] w-full mx-auto pb-16">
        <PlatformSwitcher idea={inputs.idea} />
        <div className="grid gap-5" style={{ gridTemplateColumns: "344px 1fr", alignItems: "start" }}>
          <Card className="p-5 sticky top-[88px]">
            <div className="text-[16px] font-semibold mb-4" style={{ color: "var(--text)" }}>Post Inputs</div>
            <InputPanel values={inputs} onChange={set} prefilled={prefilled ?? undefined}
              fields={["idea", "story", "audience", "lesson", "business", "variations"]} />
            <Button variant="primary" block loading={isLoading} className="mt-1.5"
              onClick={() => generate({ ...inputs })}>
              {isLoading ? "Generating…" : "Generate Post"}
            </Button>
            {error && <p className="text-[12px] mt-2" style={{ color: "var(--danger)" }}>{error}</p>}
          </Card>

          <div>
            {isLoading ? <GenLoading label="Writing your LinkedIn post…" /> : !posts.length
              ? <GenEmpty title="Your LinkedIn post will appear here" sub="Fill in the idea and hit Generate. Realistic preview with your name and formatting." />
              : (
                <div className="fade-seq">
                  {posts.length > 1 && (
                    <div className="mb-4">
                      <Tabs options={posts.map((_, i) => `Variation ${i + 1}`)} value={activeTab} onChange={setActiveTab} />
                    </div>
                  )}
                  <Card className="p-5 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl grid place-items-center font-semibold text-[16px]"
                        style={{ background: "linear-gradient(135deg, #2e2740, #1a1626)", color: "var(--gold)", border: "1px solid var(--line-2)" }}>A</div>
                      <div>
                        <div className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>Adeniyi</div>
                        <div className="text-[12px]" style={{ color: "var(--text-3)" }}>Founder / Product Leader · 2nd</div>
                      </div>
                    </div>
                    <div className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--cream)" }}>{activePost}</div>
                  </Card>
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" variant="ghost" onClick={() => generate({ ...inputs })}>Regenerate</Button>
                    <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(activePost).then(() => showToast("Copied!", "ok"))}>Copy</Button>
                    <Button size="sm" variant="secondary"
                      loading={exSaving}
                      disabled={exSaved.has(activeId)}
                      onClick={() => saveAsExample(activeId)}>
                      {exSaved.has(activeId) ? "⭐ Saved as Example" : "⭐ Save as Example"}
                    </Button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  )
}
