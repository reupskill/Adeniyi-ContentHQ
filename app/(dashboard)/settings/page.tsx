"use client"
import { useState, useEffect } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Button, Field, Input, Select, Card } from "@/components/ui"
import { useAppStore } from "@/store/useAppStore"

const TONES = ["Reflective", "Philosophical", "Conversational", "Direct", "Storytelling", "Provocative"]
const LENSES = ["Stoicism", "Naval / leverage", "Taleb / antifragility", "Systems thinking", "First principles", "None"]
const CTAS = ["Reflection question", "Subscribe", "Follow for more", "Comment prompt", "Soft sell", "No CTA"]

export default function SettingsPage() {
  const [name, setName] = useState("Adeniyi")
  const [role, setRole] = useState("Founder / Product Leader")
  const [tone, setTone] = useState("Reflective")
  const [lens, setLens] = useState("Naval / leverage")
  const [cta, setCta] = useState("Reflection question")
  const [confirmClear, setConfirmClear] = useState(false)
  const { showToast } = useAppStore()

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.default_tone) setTone(data.default_tone)
        if (data.default_philosophy) setLens(data.default_philosophy)
        if (data.default_cta) setCta(data.default_cta)
      })
      .catch(() => {})
  }, [])

  const savePreferences = async () => {
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ default_tone: tone, default_philosophy: lens, default_cta: cta }),
    })
    showToast("Preferences saved", "ok")
  }

  const clearAll = async () => {
    setConfirmClear(false)
    showToast("All data cleared")
  }

  return (
    <>
      <Topbar title="Settings" sub="Personalise your workspace" />
      <div className="px-8 py-7 max-w-[760px] w-full mx-auto pb-16">
        {/* Profile */}
        <Card className="p-5 mb-5">
          <p className="text-[16px] font-semibold mb-5" style={{ color: "var(--text)" }}>Profile</p>
          <div className="flex gap-5 items-center mb-5">
            <div className="text-center flex-shrink-0">
              <div className="w-[76px] h-[76px] rounded-[18px] grid place-items-center font-semibold text-[30px] mx-auto mb-2"
                style={{ background: "linear-gradient(135deg, #2e2740, #1a1626)", color: "var(--gold)", border: "1px solid var(--line-2)" }}>A</div>
              <button className="inline-flex items-center gap-1 text-[11.5px] px-2.5 py-1 rounded-md border cursor-pointer transition-colors"
                style={{ color: "var(--text-3)", background: "transparent", borderColor: "var(--line)", fontFamily: "inherit" }}>
                Upload
              </button>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-3.5">
                <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
                <Field label="Role"><Input value={role} onChange={(e) => setRole(e.target.value)} /></Field>
              </div>
            </div>
          </div>
        </Card>

        {/* Content preferences */}
        <Card className="p-5 mb-5">
          <p className="text-[16px] font-semibold mb-5" style={{ color: "var(--text)" }}>Content Preferences</p>
          <div className="grid grid-cols-3 gap-3.5">
            <Field label="Default tone"><Select options={TONES} value={tone} onChange={(e) => setTone(e.target.value)} /></Field>
            <Field label="Philosophical lens"><Select options={LENSES} value={lens} onChange={(e) => setLens(e.target.value)} /></Field>
            <Field label="Default CTA"><Select options={CTAS} value={cta} onChange={(e) => setCta(e.target.value)} /></Field>
          </div>
          <Button variant="primary" onClick={savePreferences} className="mt-1.5">Save preferences</Button>
        </Card>

        {/* Content Bank */}
        <Card className="p-5 mb-5">
          <p className="text-[16px] font-semibold mb-2" style={{ color: "var(--text)" }}>Content Bank</p>
          <p className="text-[13px] mb-4" style={{ color: "var(--text-3)" }}>Back up your library or restore it from a JSON file.</p>
          <div className="flex gap-2.5">
            <Button variant="secondary" onClick={() => { window.location.href = "/api/content/export" }}>Export JSON</Button>
            <Button variant="secondary">Import JSON</Button>
          </div>
        </Card>

        {/* Danger zone */}
        <Card className="p-5" style={{ borderColor: "rgba(176,96,96,0.3)" }}>
          <div className="flex items-center gap-2.5 mb-2">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p className="text-[16px] font-semibold" style={{ color: "var(--danger)" }}>Clear all data</p>
          </div>
          <p className="text-[13px] mb-4" style={{ color: "var(--text-3)" }}>Permanently delete every script, post, and bank item. This cannot be undone.</p>
          {!confirmClear ? (
            <Button variant="danger" onClick={() => setConfirmClear(true)}>Clear all data</Button>
          ) : (
            <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: "var(--danger-bg)", border: "1px solid rgba(176,96,96,0.3)" }}>
              <span className="text-[13px] flex-1" style={{ color: "var(--cream)" }}>Are you absolutely sure? This wipes everything.</span>
              <Button size="sm" variant="ghost" onClick={() => setConfirmClear(false)}>Cancel</Button>
              <Button size="sm" variant="danger" onClick={clearAll}>Yes, clear it</Button>
            </div>
          )}
        </Card>
      </div>
    </>
  )
}
