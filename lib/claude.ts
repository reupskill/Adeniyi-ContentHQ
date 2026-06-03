import Anthropic from "@anthropic-ai/sdk"

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export const CLAUDE_MODEL = "claude-sonnet-4-20250514"
export const MAX_TOKENS = 2000

export async function generateContent(
  system: string,
  user: string,
  maxTokens = MAX_TOKENS
): Promise<string> {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
  })
  const block = response.content.find((b) => b.type === "text")
  if (!block || block.type !== "text") throw new Error("No text in Claude response")
  return block.text
}

export async function streamContent(
  system: string,
  user: string,
  onChunk: (text: string) => void
): Promise<void> {
  const stream = await anthropic.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: MAX_TOKENS,
    system,
    messages: [{ role: "user", content: user }],
  })
  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      onChunk(chunk.delta.text)
    }
  }
}
