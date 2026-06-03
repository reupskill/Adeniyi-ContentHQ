import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Adeniyi Content HQ",
  description: "Personal AI-powered thought leadership content engine",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "var(--bg)", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  )
}
