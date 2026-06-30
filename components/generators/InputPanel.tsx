"use client"
import { Field, Input, Textarea, Select, Stepper } from "@/components/ui"

const TONES = ["Reflective", "Philosophical", "Conversational", "Direct", "Storytelling", "Provocative"]
const CATEGORIES = ["Philosophy", "Founder Lesson", "Leadership", "Discipline", "Growth", "Focus", "Building", "Mindset"]
const LENSES = ["Stoicism", "Naval / leverage", "Taleb / antifragility", "Systems thinking", "First principles", "None"]
const CTAS = ["Reflection question", "Subscribe", "Follow for more", "Comment prompt", "Soft sell", "No CTA"]

export const DEFAULT_INPUTS = {
  idea: "",
  story: "",
  audience: "Early-stage founders & builders",
  lesson: "",
  tone: "Reflective",
  category: "Philosophy",
  philosophy: "Stoicism",
  cta: "Reflection question",
  business: "",
  variations: 1,
}

export type GeneratorInputs = typeof DEFAULT_INPUTS

export const PLATFORM_DEFAULTS: Record<string, GeneratorInputs> = {
  video:    { ...DEFAULT_INPUTS, tone: "Conversational",  category: "Mindset",    philosophy: "Stoicism",         cta: "Reflection question" },
  linkedin: { ...DEFAULT_INPUTS, tone: "Storytelling",    category: "Leadership", philosophy: "None",             cta: "Reflection question" },
  twitter:  { ...DEFAULT_INPUTS, tone: "Direct",          category: "Leadership", philosophy: "None",             cta: "Comment prompt" },
  substack: { ...DEFAULT_INPUTS, tone: "Philosophical",   category: "Philosophy", philosophy: "Naval / leverage", cta: "Subscribe" },
}

interface Props {
  values: GeneratorInputs
  onChange: (k: keyof GeneratorInputs, v: string | number) => void
  fields?: Array<keyof GeneratorInputs>
  prefilled?: string
}

export function InputPanel({ values: v, onChange, fields, prefilled }: Props) {
  const show = (f: keyof GeneratorInputs) => !fields || fields.includes(f)
  const set = (k: keyof GeneratorInputs) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(k, e.target.value)

  return (
    <div>
      {prefilled && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-[9px] mb-4 text-[12px]"
          style={{ background: "var(--gold-dim)", border: "1px solid var(--gold-line)", color: "var(--cream)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Pre-filled from &ldquo;{prefilled}&rdquo;
        </div>
      )}
      {show("idea") && (
        <Field label="Core Idea" req>
          <Textarea value={v.idea} onChange={set("idea")} placeholder="The one idea this content revolves around…" style={{ minHeight: 64 }} />
        </Field>
      )}
      {show("story") && (
        <Field label="Personal Story / Example">
          <Textarea value={v.story} onChange={set("story")} placeholder="A lived moment that makes it real…" style={{ minHeight: 56 }} />
        </Field>
      )}
      {show("audience") && (
        <Field label="Target Audience">
          <Input value={v.audience} onChange={set("audience")} placeholder="e.g. early-stage founders" />
        </Field>
      )}
      {show("lesson") && (
        <Field label="Main Lesson">
          <Input value={v.lesson} onChange={set("lesson")} placeholder="The takeaway you want to land" />
        </Field>
      )}
      <div className="grid grid-cols-2 gap-3">
        {show("tone") && <Field label="Tone"><Select options={TONES} value={v.tone} onChange={set("tone")} /></Field>}
        {show("category") && <Field label="Category"><Select options={CATEGORIES} value={v.category} onChange={set("category")} /></Field>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {show("philosophy") && <Field label="Philosophical Lens"><Select options={LENSES} value={v.philosophy} onChange={set("philosophy")} /></Field>}
        {show("cta") && <Field label="CTA Type"><Select options={CTAS} value={v.cta} onChange={set("cta")} /></Field>}
      </div>
      {show("business") && (
        <Field label="Business Lens">
          <Input value={v.business} onChange={set("business")} placeholder="Tie it to a product or company angle" />
        </Field>
      )}
      {show("variations") && (
        <Field label="Number of Variations">
          <Stepper value={Number(v.variations)} onChange={(n) => onChange("variations", n)} min={1} max={3} />
        </Field>
      )}
    </div>
  )
}
