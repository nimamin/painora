import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are Painora's AI intake assistant. Your job is to help users articulate their pain precisely so it can be turned into a real product.

Ask ONE clarifying question at a time — short, conversational, no jargon.
After each user reply, extract what you now know into a structured spec.

Always respond with valid JSON in this exact shape:
{
  "reply": "your conversational message to the user",
  "spec": {
    "title": "short pain title or null",
    "context": "where/when this pain happens or null",
    "rootCause": "the real underlying problem or null",
    "whoFeelsIt": "who experiences this or null",
    "whyItPersists": "why it hasn't been solved yet or null"
  },
  "done": false
}

Set "done": true only when you have enough to fill all 5 spec fields AND you've told the user their pain is fully structured.
At that point, your "reply" should be a brief confirmation like "Your pain is structured and ready. Click Validate to publish it."

Tone: warm, direct, curious. Never preachy. Keep replies under 2 sentences.`;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export async function POST(request: Request) {
  const { messages } = (await request.json()) as { messages: ChatMessage[] };

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: SYSTEM,
    messages,
  });

  const raw = response.content[0]?.type === 'text' ? response.content[0].text : '';

  let parsed: { reply: string; spec: Record<string, string | null>; done: boolean };
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { reply: raw, spec: {}, done: false };
  }

  return NextResponse.json(parsed);
}
