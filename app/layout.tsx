import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Adeniyi Content HQ",
  description: "Personal AI-powered thought leadership content engine",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ background: "var(--bg)", minHeight: "100vh" }}>
        {/* Runs synchronously before React hydrates — sets theme from localStorage before first paint */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t)}catch(e){}}())` }} />
        {children}
      </body>
    </html>
  )
}
