"use client"
import { cn } from "@/lib/utils"
import React from "react"

// ── Badge ─────────────────────────────────────────────────────
type StatusType = "Idea" | "Draft" | "Ready to Record" | "Published" | string
const STATUS_STYLES: Record<string, string> = {
  "Idea": "bg-[rgba(255,255,255,0.06)] text-[var(--text-2)]",
  "Draft": "bg-[var(--draft-bg)] text-[var(--draft)]",
  "Ready to Record": "bg-[var(--ready-bg)] text-[var(--ready)]",
  "Published": "bg-[var(--published-bg)] text-[var(--published)]",
}
export function StatusBadge({ status }: { status: StatusType }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap", STATUS_STYLES[status] || STATUS_STYLES["Draft"])}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />
      {status}
    </span>
  )
}

type Platform = "Video" | "LinkedIn" | "X" | "Substack" | "All" | string
const PLATFORM_STYLES: Record<string, { color: string; bg: string }> = {
  Video:      { color: "var(--video)",     bg: "var(--video-bg)" },
  LinkedIn:   { color: "var(--linkedin)",  bg: "var(--linkedin-bg)" },
  X:          { color: "var(--x)",         bg: "var(--x-bg)" },
  Substack:   { color: "var(--substack)",  bg: "var(--substack-bg)" },
  Newsletter: { color: "var(--gold)",      bg: "var(--gold-dim)" },
  All:        { color: "var(--text-2)",    bg: "rgba(255,255,255,0.06)" },
}
export function PlatformBadge({ platform }: { platform: Platform }) {
  const s = PLATFORM_STYLES[platform] || PLATFORM_STYLES.All
  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: s.color, background: s.bg }}>
      {platform}
    </span>
  )
}

// ── Spinner ───────────────────────────────────────────────────
export function Spinner({ size = 15, light = false }: { size?: number; light?: boolean }) {
  return (
    <span className="animate-spin inline-block rounded-full" style={{
      width: size, height: size,
      border: `2px solid ${light ? "rgba(255,255,255,0.25)" : "rgba(26,20,10,0.35)"}`,
      borderTopColor: light ? "var(--gold)" : "#1a140a",
    }} />
  )
}

// ── Button ────────────────────────────────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md"
  icon?: React.ReactNode
  loading?: boolean
  block?: boolean
}
export function Button({ variant = "secondary", size = "md", icon, loading, block, children, className, ...props }: BtnProps) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg border transition-all duration-150 cursor-pointer select-none disabled:opacity-55 disabled:cursor-not-allowed whitespace-nowrap"
  const sizes = { sm: "text-[12.5px] px-3 py-1.5", md: "text-[13.5px] px-4 py-2.5" }
  const variants = {
    primary: "bg-gradient-to-b from-[var(--gold-2)] to-[var(--gold)] text-[#1a140a] border-transparent shadow-[0_6px_18px_-8px_rgba(201,169,110,0.7)] hover:brightness-105",
    secondary: "bg-[var(--surface-2)] border-[var(--line-2)] text-[var(--text)] hover:bg-[var(--surface-3)] hover:border-[var(--gold-line)]",
    ghost: "bg-transparent border-transparent text-[var(--text-2)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[var(--text)]",
    danger: "bg-transparent border-[rgba(176,96,96,0.3)] text-[var(--danger)] hover:bg-[var(--danger-bg)]",
  }
  return (
    <button
      className={cn(base, sizes[size], variants[variant], block && "w-full", className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Spinner size={14} light={variant === "primary"} /> : icon}
      {children}
    </button>
  )
}

// ── Input / Textarea / Select ─────────────────────────────────
const inputBase = "bg-[#0e0e16] border border-[var(--line-2)] rounded-lg text-[var(--text)] font-[inherit] text-[13.5px] px-3 py-2.5 w-full transition-all outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--gold-line)] focus:shadow-[0_0_0_3px_var(--gold-dim)]"

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputBase, props.className)} />
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputBase, "resize-y min-h-[76px] leading-relaxed", props.className)} />
}
export function Select({ options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) {
  return (
    <select {...props} className={cn(inputBase, "cursor-pointer appearance-none pr-8", props.className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%236f6b64' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 11px center",
      }}>
      {options.map((o) => <option key={o} value={o} style={{ background: "#14141f" }}>{o}</option>)}
    </select>
  )
}

// ── Field ─────────────────────────────────────────────────────
export function Field({ label, req, children, className }: { label: string; req?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5 mb-3.5", className)}>
      <label className="text-[12px] font-medium text-[var(--text-2)]">
        {label} {req && <span style={{ color: "var(--gold)" }}>*</span>}
      </label>
      {children}
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────
export function Card({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn("bg-[var(--surface)] border border-[var(--line)] rounded-2xl shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_16px_40px_-24px_rgba(0,0,0,0.8)]", className)} style={style}>
      {children}
    </div>
  )
}

// ── ProgressBar ───────────────────────────────────────────────
export function ProgressBar({ name, value, color }: { name: string; value: number; color?: string }) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <div className="flex justify-between items-baseline">
        <span className="text-[12.5px] text-[var(--text-2)]">{name}</span>
        <span className="text-[12px] font-semibold text-[var(--text)]">{value}</span>
      </div>
      <div className="h-[5px] rounded-full bg-[rgba(255,255,255,0.07)] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, background: color || "var(--gold)" }} />
      </div>
    </div>
  )
}

// ── CircularScore ─────────────────────────────────────────────
export function CircularScore({ score, label, size = 120 }: { score: number; label?: string; size?: number }) {
  const r = (size - 16) / 2
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <div className="inline-flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="var(--gold)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray 1s cubic-bezier(.22,.61,.36,1)" }} />
      </svg>
      <div className="absolute" style={{ position: "absolute" }} />
      <div style={{ marginTop: -size / 2 - 8, textAlign: "center" }}>
        <div className="font-serif" style={{ fontSize: size * 0.28, color: "var(--text)", lineHeight: 1 }}>{score}</div>
        {label && <div className="text-[11px] text-[var(--text-3)] mt-1">{label}</div>}
      </div>
    </div>
  )
}

// ── OutputCard ────────────────────────────────────────────────
export function OutputCard({ label, body, mono }: { label: string; body: string; mono?: boolean }) {
  const copy = () => navigator.clipboard.writeText(body).catch(() => {})
  return (
    <div className="bg-[var(--surface-2)] border border-[var(--line)] rounded-xl p-4 mb-3.5 relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold tracking-[0.14em] uppercase" style={{ color: "var(--gold)" }}>{label}</span>
        <button onClick={copy} className="inline-flex items-center gap-1 text-[11.5px] text-[var(--text-3)] bg-transparent border border-[var(--line)] rounded-md px-2 py-1 cursor-pointer hover:text-[var(--gold)] hover:border-[var(--gold-line)] transition-colors">
          <CopyIcon /> Copy
        </button>
      </div>
      <div className={cn("text-[var(--cream)] text-[14px] leading-relaxed whitespace-pre-wrap", mono && "font-mono text-[12.5px] text-[#d7cfc0]")}>
        {body}
      </div>
    </div>
  )
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

// ── Toast ─────────────────────────────────────────────────────
interface ToastItem { id: string; message: string; type: "default" | "ok" | "error" }
export function ToastHost({ toasts, dismiss }: { toasts: ToastItem[]; dismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2.5">
      {toasts.map((t) => (
        <div key={t.id}
          className="flex items-center gap-3 bg-[var(--surface-3)] border border-[var(--line-2)] rounded-xl px-4 py-3 min-w-[260px] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)] animate-[toastIn_.35s_cubic-bezier(.22,.61,.36,1)]"
          style={{ borderLeft: `3px solid ${t.type === "ok" ? "var(--ready)" : t.type === "error" ? "var(--danger)" : "var(--gold)"}` }}
          onClick={() => dismiss(t.id)}>
          <CheckIcon color={t.type === "ok" ? "var(--ready)" : t.type === "error" ? "var(--danger)" : "var(--gold)"} />
          <span className="text-[13px] text-[var(--text)]">{t.message}</span>
        </div>
      ))}
    </div>
  )
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

// ── Stepper ───────────────────────────────────────────────────
export function Stepper({ value, onChange, min = 1, max = 5 }: { value: number; onChange: (n: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center border border-[var(--line-2)] rounded-lg overflow-hidden bg-[#0e0e16] w-fit">
      <button onClick={() => onChange(Math.max(min, value - 1))} className="w-9 h-9 bg-transparent border-none text-[var(--text-2)] text-lg cursor-pointer hover:bg-[var(--surface-3)] hover:text-[var(--gold)] transition-colors">−</button>
      <span className="w-11 text-center font-semibold text-[var(--text)] text-sm">{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} className="w-9 h-9 bg-transparent border-none text-[var(--text-2)] text-lg cursor-pointer hover:bg-[var(--surface-3)] hover:text-[var(--gold)] transition-colors">+</button>
    </div>
  )
}

// ── SectionTitle ──────────────────────────────────────────────
export function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-5">
      <h1 className="font-serif text-[26px] text-[var(--text)]" style={{ fontWeight: 400 }}>{children}</h1>
      {sub && <p className="text-[13px] text-[var(--text-3)] mt-1">{sub}</p>}
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────
export function Tabs({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1 border border-[var(--line)] bg-[var(--surface-2)] p-1 rounded-xl w-fit">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)}
          className={cn("px-3.5 py-1.5 rounded-[7px] text-[12.5px] font-medium border-none cursor-pointer font-[inherit] transition-all",
            o === value ? "bg-[var(--surface-3)] text-[var(--cream)]" : "bg-transparent text-[var(--text-2)] hover:text-[var(--text)]")}>
          {o}
        </button>
      ))}
    </div>
  )
}

// ── GenLoading ────────────────────────────────────────────────
export function GenLoading({ label }: { label?: string }) {
  const steps = ["Reading your inputs", "Finding the angle", "Drafting sections", "Polishing the voice"]
  const [step, setStep] = React.useState(0)
  React.useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 360)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl flex items-center justify-center" style={{ minHeight: 440 }}>
      <div className="text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full grid place-items-center bg-[var(--gold-dim)] border border-[var(--gold-line)] shadow-[0_0_30px_-6px_rgba(201,169,110,0.5)] animate-pulse-glow">
          <Spinner size={22} light />
        </div>
        <p className="font-serif text-[18px] text-[var(--cream)] mb-4">{label || "Generating…"}</p>
        <div className="flex flex-col gap-1.5 items-start w-48 mx-auto">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 text-[12.5px] transition-colors duration-300"
              style={{ color: i <= step ? "var(--text)" : "var(--text-faint)" }}>
              {i < step
                ? <CheckCircleIcon color="var(--ready)" />
                : i === step
                  ? <Spinner size={13} light />
                  : <span className="w-3 h-3 rounded-full border border-[var(--text-faint)]" />}
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CheckCircleIcon({ color }: { color: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
      <polyline points="9 12 11 14 15 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ── GenEmpty ──────────────────────────────────────────────────
export function GenEmpty({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl flex items-center justify-center" style={{ minHeight: 440 }}>
      <div className="text-center px-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] grid place-items-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <p className="font-serif text-[19px] text-[var(--text)] mb-2">{title}</p>
        {sub && <p className="text-[13px] text-[var(--text-3)] max-w-[300px] mx-auto leading-relaxed">{sub}</p>}
      </div>
    </div>
  )
}
