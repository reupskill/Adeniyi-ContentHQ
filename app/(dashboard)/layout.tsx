export const dynamic = "force-dynamic"

import { Sidebar } from "@/components/layout/Sidebar"
import ToastProvider from "@/components/layout/ToastProvider"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)", backgroundImage: "radial-gradient(1200px 600px at 78% -8%, #15131c 0%, #0b0b0f 55%)", backgroundAttachment: "fixed" }}>
      <Sidebar />
      <main className="flex-1 flex flex-col" style={{ marginLeft: "244px" }}>
        {children}
      </main>
      <ToastProvider />
    </div>
  )
}
