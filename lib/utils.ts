import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function parseVideoScriptSections(raw: string) {
  const sections: Record<string, string> = {}
  const labels = [
    "HOOK",
    "STORY",
    "INSIGHT",
    "CLOSE",
    "CAPTION",
    "ON-SCREEN TEXT",
    "B-ROLL IDEAS",
    "MUSIC MOOD",
    "RECORDING DIRECTION",
  ]
  const keys: Record<string, string> = {
    "HOOK": "hook",
    "STORY": "story",
    "INSIGHT": "insight",
    "CLOSE": "close",
    "CAPTION": "caption",
    "ON-SCREEN TEXT": "onScreenText",
    "B-ROLL IDEAS": "brollIdeas",
    "MUSIC MOOD": "musicMood",
    "RECORDING DIRECTION": "recordingDirection",
  }

  labels.forEach((label, i) => {
    const nextLabel = labels[i + 1]
    const regex = nextLabel
      ? new RegExp(`${label}[:\\s]*([\\s\\S]*?)(?=${nextLabel}|$)`, "i")
      : new RegExp(`${label}[:\\s]*([\\s\\S]*)`, "i")
    const match = raw.match(regex)
    if (match) {
      sections[keys[label]] = match[1].trim()
    }
  })
  return sections
}

export function parseSubstackSections(raw: string) {
  const sections: Record<string, string> = {}
  const labels = [
    "TITLE OPTIONS",
    "SUBTITLE",
    "OPENING STORY",
    "MAIN ARGUMENT",
    "SECTION 1",
    "SECTION 2",
    "SECTION 3",
    "PRACTICAL REFLECTION",
    "CLOSING PARAGRAPH",
    "NEWSLETTER CTA",
  ]
  const keys: Record<string, string> = {
    "TITLE OPTIONS": "titleOptions",
    "SUBTITLE": "subtitle",
    "OPENING STORY": "openingStory",
    "MAIN ARGUMENT": "mainArgument",
    "SECTION 1": "section1",
    "SECTION 2": "section2",
    "SECTION 3": "section3",
    "PRACTICAL REFLECTION": "practicalReflection",
    "CLOSING PARAGRAPH": "closingParagraph",
    "NEWSLETTER CTA": "newsletterCta",
  }

  labels.forEach((label, i) => {
    const nextLabel = labels[i + 1]
    const regex = nextLabel
      ? new RegExp(`${label.replace(/\s/g, "\\s*")}[:\\s]*([\\s\\S]*?)(?=${nextLabel.replace(/\s/g, "\\s*")}|$)`, "i")
      : new RegExp(`${label.replace(/\s/g, "\\s*")}[:\\s]*([\\s\\S]*)`, "i")
    const match = raw.match(regex)
    if (match) {
      sections[keys[label]] = match[1].trim()
    }
  })
  return sections
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function estimateReadingTime(wordCount: number): string {
  const minutes = Math.ceil(wordCount / 200)
  return `~${minutes} min read`
}

export function getTrend(current: number, previous: number): number {
  if (previous === 0) return 0
  return Math.round(((current - previous) / previous) * 100)
}

export function snakeToCamel(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = obj[key]
  }
  return result
}

export function camelToSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(obj)) {
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase()
    result[snakeKey] = obj[key]
  }
  return result
}
