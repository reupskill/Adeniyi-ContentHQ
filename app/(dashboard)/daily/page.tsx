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

function InspoBlock({ title, children, count }: { title: string; children: React.ReactNode; count: number }) {
  return (
    <Card className="p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[15px] font-semibold" style={{ color: "var(--text)" }}>{title}</span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: "var(--gold)", background: "var(--gold-dim)" }}>{count}</span>
      </div>
      {children}
    </Card>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2.5 py-2.5 border-b border-[var(--line)] last:border-b-0">
          <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--gold)" }} />
          <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--text-2)" }}>{item}</p>
        </div>
      ))}
    </div>
  )
}

export default function DailyPage() {
  const [vals, setVals] = useState<Record<string, string>>({})
  const [output, setOutput] = useState<DailyInspirationOutput | null>(null)
  const { showToast } = useAppStore()
  const router = useRouter()
  const { generate, isLoading, error } = useGenerate({
    endpoint: "/api/generate/daily-inspiration",
    onSuccess: (data) => {
      setOutput(data as DailyInspirationOutput)
      showToast("Content ideas generated", "ok")
    },
    onError: (e) => showToast(e, "error"),
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setVals((v) => ({ ...v, [k]: e.target.value }))

  return (
    <>
      <Topbar title="Daily Inspiration" sub="A day of life → a week of content" />
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
            <InspoBlock title="10 Daily Content Ideas" count={output.contentIdeas.length}>
              <div className="grid grid-cols-2 gap-3">
                {output.contentIdeas.map((idea, i) => (
                  <button key={i} onClick={() => { showToast("Loaded into generator", "ok"); router.push("/video") }}
                    className="flex items-center gap-3 p-3.5 rounded-xl text-left cursor-pointer transition-all"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--line)", fontFamily: "inherit" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold-line)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--line)")}>
                    <span className="font-serif text-[18px] flex-shrink-0 w-7 text-center" style={{ color: "var(--gold)" }}>{i + 1}</span>
                    <span className="text-[13.5px] leading-snug flex-1" style={{ color: "var(--text)" }}>{idea}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                ))}
              </div>
            </InspoBlock>

            <div className="grid grid-cols-2 gap-5">
              <InspoBlock title="5 Video Hooks" count={5}>
                {output.videoHooks.map((hook, i) => (
                  <div key={i} className="flex items-start gap-3 py-3 border-b border-[var(--line)] last:border-b-0">
                    <p className="text-[14px] leading-relaxed flex-1" style={{ color: "var(--cream)" }}>&ldquo;{hook}&rdquo;</p>
                    <Button size="sm" variant="secondary" onClick={() => { showToast("Hook loaded", "ok"); router.push("/video") }}>Use Hook</Button>
                  </div>
                ))}
              </InspoBlock>
              <InspoBlock title="5 LinkedIn Angles" count={5}><BulletList items={output.linkedinAngles} /></InspoBlock>
              <InspoBlock title="5 X Post Ideas" count={5}><BulletList items={output.xPostIdeas} /></InspoBlock>
              <InspoBlock title="3 Substack Essay Angles" count={3}><BulletList items={output.substackAngles} /></InspoBlock>
              <InspoBlock title="3 Personal Story Prompts" count={3}><BulletList items={output.storyPrompts} /></InspoBlock>
              <InspoBlock title="3 Philosophical Connections" count={3}><BulletList items={output.philosophicalConnections} /></InspoBlock>
            </div>
            <InspoBlock title="3 Business Metaphors" count={3}><BulletList items={output.businessMetaphors} /></InspoBlock>
          </div>
        )}
      </div>
    </>
  )
}
