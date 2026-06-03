"use client"
import { useState } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { InputPanel, DEFAULT_INPUTS, GeneratorInputs } from "@/components/generators/InputPanel"
import { Button, Tabs, GenLoading, GenEmpty, Card } from "@/components/ui"
import { useGenerate } from "@/hooks/useGenerate"
import { useAppStore } from "@/store/useAppStore"

export default function LinkedInPage() {
  const [inputs, setInputs] = useState<GeneratorInputs>(DEFAULT_INPUTS)
  const [posts, setPosts] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("Variation 1")
  const { showToast } = useAppStore()
  const { generate, isLoading, error } = useGenerate({
    endpoint: "/api/generate/linkedin",
    onSuccess: (data: any) => {
      setPosts(data.posts || [data.raw])
      setActiveTab("Variation 1")
      showToast("LinkedIn post generated", "ok")
    },
    onError: (e) => showToast(e, "error"),
  })

  const set = (k: keyof GeneratorInputs, v: string | number) => setInputs((p) => ({ ...p, [k]: v }))
  const activePost = posts[parseInt(activeTab.split(" ")[1]) - 1] || ""

  return (
    <>
      <Topbar title="LinkedIn Post Generator" sub="Reflective posts that build influence" />
      <div className="px-8 py-7 max-w-[1620px] w-full mx-auto pb-16">
        <div className="grid gap-5" style={{ gridTemplateColumns: "344px 1fr", alignItems: "start" }}>
          <Card className="p-5 sticky top-[88px]">
            <div className="text-[16px] font-semibold mb-4" style={{ color: "var(--text)" }}>Post Inputs</div>
            <InputPanel values={inputs} onChange={set} />
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
                  {/* LinkedIn preview card */}
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
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => generate({ ...inputs })}>Regenerate</Button>
                    <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(activePost).then(() => showToast("Copied!", "ok"))}>Copy</Button>
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
