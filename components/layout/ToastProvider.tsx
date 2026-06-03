"use client"
import { useAppStore } from "@/store/useAppStore"
import { ToastHost } from "@/components/ui"

export default function ToastProvider() {
  const { toasts, dismissToast } = useAppStore()
  return <ToastHost toasts={toasts} dismiss={dismissToast} />
}
