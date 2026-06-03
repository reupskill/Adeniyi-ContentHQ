"use client"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "var(--bg)",
      backgroundImage: "radial-gradient(1200px 600px at 78% -8%, #15131c 0%, #0b0b0f 55%)",
    }}>
      {/* Left brand panel */}
      <div style={{
        flex: "1.15",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(155deg, #16131f 0%, #0c0b12 60%)",
        borderRight: "1px solid var(--line)",
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{
          position: "absolute", top: "-120px", right: "-120px",
          width: "460px", height: "460px",
          background: "radial-gradient(circle, rgba(201,169,110,0.16) 0%, rgba(201,169,110,0) 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "relative", zIndex: 2,
          padding: "64px 72px",
          display: "flex", flexDirection: "column", gap: "48px",
          maxWidth: "620px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "13px",
              background: "radial-gradient(120% 120% at 30% 20%, #2a2436 0%, #15131d 70%)",
              border: "1px solid var(--gold-line)",
              display: "grid", placeItems: "center",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.4), 0 6px 16px -8px rgba(201,169,110,0.4)",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2.5c-3 0-5.3 2.4-5.3 5.4 0 2 1.1 3.7 2.7 4.7.5.3.8.8.8 1.4v.8h3.6v-.8c0-.6.3-1.1.8-1.4 1.6-1 2.7-2.7 2.7-4.7 0-3-2.3-5.4-5.3-5.4Z"
                  fill="none" stroke="#c9a96e" strokeWidth="1.5" />
                <path d="M9.4 18.5h5.2M10 21h4" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="8" r="1.6" fill="#c9a96e" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", color: "var(--cream)", lineHeight: 1.1 }}>Adeniyi Content HQ</div>
              <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "3px" }}>Thought Leadership Engine</div>
            </div>
          </div>

          <div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "42px",
              color: "var(--cream)",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}>
              Create once.<br />
              Share everywhere.<br />
              <span style={{ color: "var(--gold)" }}>Build influence.</span>
            </h1>
            <p style={{ fontSize: "16px", color: "var(--text-2)", lineHeight: 1.65, maxWidth: "440px" }}>
              Your personal AI-powered command centre for video scripts, LinkedIn posts, X threads, and Substack essays — all in one focused workspace.
            </p>
          </div>

          <div style={{
            display: "flex", gap: "14px",
            padding: "20px 22px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid var(--line)",
            maxWidth: "460px",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: "var(--gold)", flexShrink: 0, marginTop: "2px" }}>
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <div>
              <p style={{ fontSize: "14px", color: "var(--cream)", lineHeight: 1.65, fontStyle: "italic", margin: 0 }}>
                &ldquo;The unexamined strategy is just hope with a deck.&rdquo;
              </p>
              <p style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "8px" }}>— Naval Ravikant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        width: "520px", maxWidth: "46vw", flexShrink: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px",
      }}>
        <div style={{
          width: "100%", maxWidth: "392px",
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "20px",
          padding: "32px 30px 26px",
          boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset, 0 16px 40px -24px rgba(0,0,0,0.8)",
        }}>
          <div style={{
            width: "52px", height: "52px",
            borderRadius: "15px", margin: "0 auto 20px",
            display: "grid", placeItems: "center",
            background: "var(--gold-dim)",
            border: "1px solid var(--gold-line)",
            boxShadow: "0 0 28px -8px rgba(201,169,110,0.5)",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="var(--gold)" strokeWidth="1.8" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>

          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "24px",
            color: "var(--cream)",
            textAlign: "center",
            marginBottom: "6px",
          }}>Welcome back</h2>
          <p style={{ fontSize: "13px", color: "var(--text-3)", textAlign: "center", marginBottom: "28px" }}>
            Sign in to access your workspace
          </p>

          {error && (
            <div style={{
              background: "var(--danger-bg)",
              border: "1px solid rgba(176,96,96,0.3)",
              borderRadius: "10px",
              padding: "12px 14px",
              marginBottom: "20px",
              fontSize: "13px",
              color: "var(--danger)",
            }}>
              Access denied. This tool is private — only the authorized account can sign in.
            </div>
          )}

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              width: "100%", padding: "12px",
              borderRadius: "8px",
              background: "var(--surface-2)",
              border: "1px solid var(--line-2)",
              color: "var(--text)",
              fontFamily: "inherit", fontSize: "14px", fontWeight: 600,
              cursor: "pointer",
              transition: "background .15s, border-color .15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-3)"
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = "var(--gold-line)"
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-2)"
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = "var(--line-2)"
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            marginTop: "20px", padding: "10px 12px",
            borderRadius: "9px",
            background: "var(--ready-bg)",
            border: "1px solid rgba(76,175,128,0.2)",
            fontSize: "11.5px", color: "var(--text-2)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "var(--ready)", flexShrink: 0 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            Only the authorized Gmail account can access this workspace.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <LoginContent />
    </Suspense>
  )
}
