"use client"
import { signOut } from "next-auth/react"

interface TopbarProps {
  title: string
  sub?: string
}

export function Topbar({ title, sub }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 px-8 py-4"
      style={{
        background: "rgba(11,11,15,0.72)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--line)",
      }}>
      <div>
        <h1 className="font-serif text-[24px] font-normal" style={{ color: "var(--text)" }}>{title}</h1>
        {sub && <div className="text-[13px] mt-0.5" style={{ color: "var(--text-3)" }}>{sub}</div>}
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3 text-[12.5px]" style={{ color: "var(--text-2)" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: "var(--ready)" }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        Only authorized email can access
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="w-9 h-9 rounded-[10px] grid place-items-center font-semibold text-[15px] cursor-pointer border"
        style={{ background: "linear-gradient(135deg, #2e2740, #1a1626)", color: "var(--gold)", borderColor: "var(--line-2)" }}
        title="Sign out">
        A
      </button>
    </header>
  )
}
