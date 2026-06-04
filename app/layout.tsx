import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Adeniyi Content HQ",
  description: "Personal AI-powered thought leadership content engine",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Prevent flash by applying saved theme before first paint */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.setAttribute('data-theme',localStorage.getItem('theme')||'dark')}catch(e){}` }} />
      </head>
      <body style={{ background: "var(--bg)", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  )
}
