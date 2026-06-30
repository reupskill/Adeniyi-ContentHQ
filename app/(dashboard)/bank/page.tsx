"use client"
import { useState, useRef } from "react"
import { Topbar } from "@/components/layout/Topbar"
import { Button, StatusBadge, PlatformBadge, Card } from "@/components/ui"
import { useContentBank } from "@/hooks/useContentBank"
import { useAppStore } from "@/store/useAppStore"
import type { ContentItem, ContentStatus } from "@/types"
import Link from "next/link"

const PLATFORMS = ["All", "Newsletter", "Video", "LinkedIn", "X", "Substack"]
const STATUSES = ["All", "Idea", "Draft", "Ready to Record", "Published"]

function FilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: "var(--text-faint)" }}>{label}</span>
      <div className="flex gap-1">
        {options.map((o) => (
          <button key={o} onClick={() => onChange(o)}
            className="px-2.5 py-1 rounded-[7px] text-[12.5px] font-medium cursor-pointer border transition-all"
            style={{
              fontFamily: "inherit",
              borderColor: value === o ? "var(--gold-line)" : "transparent",
              background: value === o ? "var(--gold-dim)" : "transparent",
              color: value === o ? "var(--cream)" : "var(--text-2)",
            }}>
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

const PLATFORM_HREF: Record<string, string> = { Video: "/video", LinkedIn: "/linkedin", X: "/twitter", Substack: "/substack", All: "/video" }

export default function BankPage() {
  const [platFilter, setPlatFilter] = useState("All")
  const [statFilter, setStatFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [preview, setPreview] = useState<ContentItem | null>(null)
  const { showToast } = useAppStore()

  const importRef = useRef<HTMLInputElement>(null)
  const { items, total, isLoading, updateStatus, deleteItem, refresh } = useContentBank({
    platform: platFilter as any,
    status: statFilter as any,
    search,
  })

  const handleStatusChange = async (id: string, status: ContentStatus) => {
    try { await updateStatus(id, status); showToast(`Status updated to ${status}`, "ok") }
    catch { showToast("Failed to update status", "error") }
    setOpenMenu(null)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const items = Array.isArray(data) ? data : []
      const res = await fetch("/api/content/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      })
      const result = await res.json()
      if (res.ok) { showToast(`Imported ${result.imported} items`, "ok"); refresh() }
      else showToast(result.error || "Import failed", "error")
    } catch {
      showToast("Invalid JSON file", "error")
    }
    e.target.value = ""
  }

  const handleDelete = async (id: string) => {
    try { await deleteItem(id); showToast("Item deleted") }
    catch { showToast("Failed to delete", "error") }
  }

  const handleTrainingToggle = async (item: ContentItem) => {
    const isNow = !item.metadata?.isTrainingExample
    try {
      const res = await fetch(`/api/content/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metadata: { ...item.metadata, isTrainingExample: isNow } }),
      })
      if (res.ok) { showToast(isNow ? "Added to training examples ⭐" : "Removed from training", "ok"); refresh() }
      else showToast("Failed to update", "error")
    } catch { showToast("Failed to update", "error") }
  }

  return (
    <>
      <Topbar title="Content Bank" sub="Your personal content library" />
      <div className="px-8 py-7 max-w-[1620px] w-full mx-auto pb-16">
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <p className="text-[13px]" style={{ color: "var(--text-3)" }}>{total} pieces in your library</p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary"
              onClick={() => { window.location.href = "/api/content/export" }}>Export JSON</Button>
            <Button size="sm" variant="secondary" onClick={() => importRef.current?.click()}>Import JSON</Button>
            <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          </div>
        </div>

        <Card className="px-4 py-3.5 mb-5 flex gap-4 items-center flex-wrap">
          <FilterGroup label="Platform" options={PLATFORMS} value={platFilter} onChange={setPlatFilter} />
          <div className="w-px h-7" style={{ background: "var(--line)" }} />
          <FilterGroup label="Status" options={STATUSES} value={statFilter} onChange={setStatFilter} />
          <div className="flex-1" />
          <div className="relative min-w-[220px]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input className="bg-[#0e0e16] border border-[var(--line-2)] rounded-lg text-[var(--text)] text-[13.5px] pl-9 pr-3 py-2 w-full outline-none focus:border-[var(--gold-line)]"
              value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search content…" />
          </div>
        </Card>

        {isLoading ? (
          <div className="text-center py-12 text-[var(--text-3)]">Loading…</div>
        ) : items.length === 0 ? (
          <Card>
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl grid place-items-center" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="1.5"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
              </div>
              <p className="font-serif text-[19px] mb-2" style={{ color: "var(--text)" }}>No content here yet</p>
              <p className="text-[13px] mb-5" style={{ color: "var(--text-3)" }}>Generate your first piece and it&apos;ll land right here.</p>
              <Link href="/video"><Button variant="primary">Create your first content</Button></Link>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <Card key={item.id} className="px-4.5 py-4 flex gap-4 items-start" style={{ padding: "16px 18px" }}>
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <button onClick={() => setPreview(item)}
                    className="font-serif text-[16.5px] leading-snug text-left bg-transparent border-none cursor-pointer p-0 transition-colors hover:text-[var(--gold)]"
                    style={{ color: "var(--text)", fontFamily: "'DM Serif Display', serif" }}>
                    {item.title}
                  </button>
                  <div className="flex items-center gap-2 flex-wrap">
                    <PlatformBadge platform={item.platform} />
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ color: "var(--text-2)", background: "rgba(255,255,255,0.06)" }}>{item.category}</span>
                    <span className="text-[12px]" style={{ color: "var(--text-3)" }}>· {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)", maxWidth: 760 }}>{item.content.slice(0, 200)}…</p>
                </div>
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <div className="relative">
                    <button onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}
                      className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0">
                      <StatusBadge status={item.status} />
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                    {openMenu === item.id && (
                      <div className="absolute top-[125%] right-0 z-30 rounded-xl p-1.5 min-w-[168px] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)]"
                        style={{ background: "var(--surface-3)", border: "1px solid var(--line-2)" }}>
                        {(["Idea", "Draft", "Ready to Record", "Published"] as ContentStatus[]).map((s) => (
                          <button key={s} onClick={() => handleStatusChange(item.id, s)}
                            className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.05)] bg-transparent border-none"
                            style={{ fontFamily: "inherit" }}>
                            <StatusBadge status={s} />
                            {item.status === s && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setPreview(item)} className="p-1.5 rounded-md bg-transparent border-none cursor-pointer text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.05)] transition-colors" title="Preview">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button
                      onClick={() => handleTrainingToggle(item)}
                      className="p-1.5 rounded-md bg-transparent border-none cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                      title={item.metadata?.isTrainingExample ? "Remove from training examples" : "Mark as training example"}
                      style={{ color: item.metadata?.isTrainingExample ? "var(--gold)" : "var(--text-3)" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24"
                        fill={item.metadata?.isTrainingExample ? "var(--gold)" : "none"}
                        stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </button>
                    <button onClick={() => navigator.clipboard.writeText(item.content).then(() => showToast("Copied!", "ok"))} className="p-1.5 rounded-md bg-transparent border-none cursor-pointer text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.05)] transition-colors" title="Copy">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                    <Link href={`${PLATFORM_HREF[item.platform] || "/video"}?id=${item.id}`} className="p-1.5 rounded-md text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.05)] transition-colors" title="Edit">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </Link>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-md bg-transparent border-none cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-colors" title="Delete" style={{ color: "var(--danger)" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Preview slide-over */}
        {preview && (
          <>
            <div className="fixed inset-0 z-[100] animate-fade-in" style={{ background: "rgba(5,5,8,0.55)", backdropFilter: "blur(2px)" }} onClick={() => setPreview(null)} />
            <div className="fixed top-0 right-0 bottom-0 w-[460px] max-w-[92vw] overflow-y-auto z-[101] animate-slide-in"
              style={{ background: "var(--surface)", borderLeft: "1px solid var(--line-2)", boxShadow: "-30px 0 60px -20px rgba(0,0,0,0.7)" }}>
              <div className="px-6 py-5 border-b border-[var(--line)] flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                    <PlatformBadge platform={preview.platform} />
                    <StatusBadge status={preview.status} />
                  </div>
                  <h2 className="font-serif text-[22px] leading-snug" style={{ color: "var(--text)" }}>{preview.title}</h2>
                  <p className="text-[12px] mt-2" style={{ color: "var(--text-3)" }}>{preview.category} · {new Date(preview.createdAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => setPreview(null)} className="p-2 bg-transparent border-none cursor-pointer rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors" style={{ color: "var(--text-2)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="p-6">
                <div className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-2.5" style={{ color: "var(--gold)" }}>Full content</div>
                <div className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--cream)" }}>{preview.content}</div>
                <div className="mt-6">
                  <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(preview.content).then(() => showToast("Copied!", "ok"))}>Copy content</Button>
                </div>
                <div className="mt-5">
                  <p className="text-[11px] font-semibold tracking-[0.12em] uppercase mb-2.5" style={{ color: "var(--text-3)" }}>Open in editor</p>
                  <div className="flex flex-wrap gap-2">
                    {(["Video", "LinkedIn", "X", "Substack"] as const).map((p) => {
                      const href = `${PLATFORM_HREF[p]}?id=${preview.id}`
                      const colors: Record<string, string> = { Video: "var(--video)", LinkedIn: "var(--linkedin)", X: "#46c4ac", Substack: "var(--substack)" }
                      const color = colors[p]
                      const isNative = preview.platform === p
                      return (
                        <Link key={p} href={href} onClick={() => setPreview(null)}>
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium border cursor-pointer transition-all"
                            style={{
                              background: isNative ? `${color}22` : "transparent",
                              borderColor: isNative ? color : "var(--line-2)",
                              color: isNative ? color : "var(--text-2)",
                              fontFamily: "inherit",
                            }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                            {p}
                          </button>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
