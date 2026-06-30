"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/",          label: "Dashboard",         icon: "home" },
  { href: "/video",     label: "Video Scripts",      icon: "video" },
  { href: "/linkedin",  label: "LinkedIn",           icon: "linkedin" },
  { href: "/twitter",   label: "X / Twitter",        icon: "x" },
  { href: "/substack",  label: "Substack",           icon: "substack" },
  { href: "/daily",     label: "Daily Inspiration",  icon: "lightbulb" },
  { href: "/ai-brief",  label: "AI Brief",           icon: "aibrief" },
  { href: "/analyzer",  label: "Script Analyzer",    icon: "target" },
  { href: "/bank",      label: "Content Bank",       icon: "archive" },
  { href: "/training",  label: "Training Examples",  icon: "star" },
  { href: "/calendar",  label: "Content Calendar",   icon: "calendar" },
  { href: "/prompts",   label: "Prompt Generator",   icon: "terminal" },
  { href: "/settings",  label: "Settings",           icon: "settings" },
]

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    video: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
    lightbulb: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>,
    aibrief: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
    target: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    archive: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>,
    calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    terminal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
    settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    star: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    linkedin: <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--linkedin)" }}>in</span>,
    x:        <span style={{ fontSize: "13px", fontWeight: 700 }}>𝕏</span>,
    substack: <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--substack)" }}>S</span>,
  }
  return <span className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">{icons[name] || icons.home}</span>
}

function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null)

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") !== "light")
  }, [])

  const toggle = () => {
    setDark((prev) => {
      const next = !prev
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light")
      localStorage.setItem("theme", next ? "dark" : "light")
      return next
    })
  }

  // Don't render until we know the real theme — prevents icon flicker on load
  if (dark === null) return <div style={{ width: 28, height: 28 }} />

  return (
    <button
      onClick={toggle}
      className="p-1.5 rounded-md transition-colors"
      style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-3)" }}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}>
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[244px] flex flex-col z-40"
      style={{ background: "var(--sidebar-bg)", borderRight: "1px solid var(--line)" }}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="w-[38px] h-[38px] rounded-[11px] flex-shrink-0 grid place-items-center"
          style={{
            background: "radial-gradient(120% 120% at 30% 20%, #2a2436 0%, #15131d 70%)",
            border: "1px solid var(--gold-line)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.4), 0 6px 16px -8px rgba(201,169,110,0.4)",
          }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2.5c-3 0-5.3 2.4-5.3 5.4 0 2 1.1 3.7 2.7 4.7.5.3.8.8.8 1.4v.8h3.6v-.8c0-.6.3-1.1.8-1.4 1.6-1 2.7-2.7 2.7-4.7 0-3-2.3-5.4-5.3-5.4Z" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
            <path d="M9.4 18.5h5.2M10 21h4" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="8" r="1.6" fill="var(--gold)" />
          </svg>
        </div>
        <div>
          <div className="font-serif text-[17px] leading-tight" style={{ color: "var(--cream)" }}>Adeniyi Content HQ</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--text-3)" }}>Thought Leadership Engine</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 flex flex-col gap-0.5 py-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium border border-transparent transition-all no-underline relative whitespace-nowrap",
                active
                  ? "text-[var(--cream)]"
                  : "text-[var(--text-2)] hover:bg-[rgba(128,128,128,0.07)] hover:text-[var(--text)]"
              )}
              style={active ? {
                background: "linear-gradient(90deg, rgba(201,169,110,0.13), rgba(201,169,110,0.03))",
              } : {}}>
              {active && (
                <span className="absolute left-[-12px] top-[7px] bottom-[7px] w-[3px] rounded-r-sm"
                  style={{ background: "var(--gold)", boxShadow: "0 0 10px 0 rgba(201,169,110,0.6)" }} />
              )}
              <NavIcon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer profile */}
      <div className="p-3 border-t border-[var(--line)]">
        <div className="bg-[var(--surface-2)] border border-[var(--line)] rounded-xl p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-[38px] h-[38px] rounded-[10px] flex-shrink-0 grid place-items-center text-[15px] font-semibold"
              style={{ background: "linear-gradient(135deg, #2e2740, #1a1626)", color: "var(--gold)", border: "1px solid var(--line-2)" }}>
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-[var(--text)]">Adeniyi</div>
              <div className="text-[11px] text-[var(--text-3)]">Founder / Product Leader</div>
            </div>
            <ThemeToggle />
            <button onClick={() => signOut({ callbackUrl: "/login" })}
              className="p-1.5 rounded-md transition-colors"
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-3)" }}
              title="Sign out">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
          <div className="mt-2.5 rounded-[10px] p-2.5"
            style={{ background: "linear-gradient(135deg, rgba(201,169,110,0.10), rgba(201,169,110,0.02))", border: "1px solid var(--gold-line)" }}>
            <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              <span className="text-[12.5px] font-semibold" style={{ color: "var(--cream)" }}>Pro Plan</span>
            </div>
            <div className="h-[5px] rounded-full mt-2.5 mb-1 overflow-hidden" style={{ background: "rgba(128,128,128,0.14)" }}>
              <div className="h-full rounded-full" style={{ width: "67%", background: "linear-gradient(90deg, var(--gold), var(--gold-2))" }} />
            </div>
            <div className="text-[10.5px]" style={{ color: "var(--text-3)" }}>67% of monthly usage</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
