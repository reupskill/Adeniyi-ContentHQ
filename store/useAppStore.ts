"use client"
import { create } from "zustand"

interface Toast {
  id: string
  message: string
  type: "default" | "ok" | "error"
}

interface AppStore {
  toasts: Toast[]
  showToast: (message: string, type?: "default" | "ok" | "error") => void
  dismissToast: (id: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  toasts: [],
  showToast: (message, type = "default") => {
    const id = Math.random().toString(36).slice(2)
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 3500)
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
