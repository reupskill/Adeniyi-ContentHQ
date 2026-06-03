"use client"
import { useEffect } from "react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Dashboard Error]", error)
  }, [error])

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl grid place-items-center"
          style={{ background: "var(--danger-bg)", border: "1px solid rgba(176,96,96,0.3)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 className="font-serif text-[22px] mb-2" style={{ color: "var(--text)" }}>Something went wrong</h2>
        <p className="text-[13.5px] leading-relaxed mb-6" style={{ color: "var(--text-2)" }}>
          {error.message || "An unexpected error occurred loading this page."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer border transition-all"
            style={{ background: "var(--surface-2)", border: "1px solid var(--line-2)", color: "var(--text)" }}>
            Try again
          </button>
          <a
            href="/"
            className="px-4 py-2 rounded-lg text-[13px] font-semibold no-underline border transition-all"
            style={{
              background: "linear-gradient(to bottom, var(--gold-2), var(--gold))",
              border: "1px solid transparent",
              color: "#1a140a",
            }}>
            Go to dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
