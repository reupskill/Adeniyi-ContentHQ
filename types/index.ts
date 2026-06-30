export type Platform = "Video" | "LinkedIn" | "X" | "Substack" | "Newsletter" | "All"
export type ContentStatus = "Idea" | "Draft" | "Ready to Record" | "Published"

export interface ContentItem {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  title: string
  platform: Platform
  category: string
  status: ContentStatus
  content: string
  rawInputs?: Record<string, unknown>
  metadata?: Record<string, unknown> & { isTrainingExample?: boolean }
  scoreOverall?: number
  scoreHook?: number
  scoreClarity?: number
  scoreDepth?: number
  scoreEmotionalImpact?: number
  scoreCta?: number
  scoreTip?: string
  scheduledDate?: string
  publishedAt?: string
}

export interface ScriptScores {
  overall: number
  hookStrength: number
  clarity: number
  depth: number
  emotionalImpact: number
  callToAction: number
  tip: string
  strengths: string[]
  improvements: string[]
}

export interface VideoScriptSections {
  hook: string
  story: string
  insight: string
  close: string
  caption: string
  onScreenText: string
  brollIdeas: string
  musicMood: string
  recordingDirection: string
}

export interface DailyInspirationOutput {
  contentIdeas: string[]
  videoHooks: string[]
  linkedinAngles: string[]
  xPostIdeas: string[]
  substackAngles: string[]
  storyPrompts: string[]
  philosophicalConnections: string[]
  businessMetaphors: string[]
}

export interface CalendarDay {
  id: string
  calendarDate: string
  dayNumber: number
  category: string
  topic: string
  hook?: string
  mainMessage?: string
  bestPlatform?: string
  repurposeRecommendation?: string
  cta?: string
  contentItemId?: string
  isCompleted: boolean
}

export interface DashboardStats {
  ideasGenerated: { count: number; trend: number }
  scriptsReady: { count: number; trend: number }
  repurposedPosts: { count: number; trend: number }
  contentScheduled: { count: number; trend: number }
  contentBankItems: { count: number; trend: number }
}

export interface AppSettings {
  defaultTone: string
  defaultPhilosophy: string
  defaultCta: string
  defaultCategory: string
  defaultAudience: string
}

export interface GenerateVideoScriptInput {
  idea: string
  story?: string
  audience?: string
  lesson?: string
  tone: string
  category: string
  philosophy: string
  cta: string
  business?: string
  variations?: number
}

export interface PipelineItem {
  platform: Platform
  status: "ready" | "generating" | "draft"
  contentItemId?: string
  note?: string
}
