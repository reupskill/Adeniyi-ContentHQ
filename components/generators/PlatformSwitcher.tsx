"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const PLATFORMS = [
  { id: "video",    label: "Video",    href: "/video",    color: "var(--video)" },
  { id: "linkedin", label: "LinkedIn", href: "/linkedin", color: "var(--linkedin)" },
  { id: "twitter",  label: "X",        href: "/twitter",  color: "#46c4ac" },
  { id: "substack", label: "Substack", href: "/substack", color: "var(--substack)" },
]

export function PlatformSwitcher({ idea }: { idea?: string }) {
  const pathname = usePathname()

  return (
    <div className="flex gap-2 flex-wrap mb-5">
      {PLATFORMS.map(({ id, label, href, color }) => {
        const isActive = pathname === href
        const url = idea ? `${href}?idea=${encodeURIComponent(idea)}` : href
        return (
          <Link key={id} href={url}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium border transition-all"
            style={{
              background: isActive ? `${color}22` : "var(--surface-2)",
              borderColor: isActive ? color : "var(--line-2)",
              color: isActive ? color : "var(--text-2)",
            }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
            {label}
          </Link>
        )
      })}
    </div>
  )
}
