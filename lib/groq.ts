const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY ?? '';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

export type GroqMessage = { role: 'system' | 'user' | 'assistant'; content: string };

const SYSTEM_PROMPT = `You are Solacera, a warm and empathetic companion supporting caregivers.
Your role is to provide compassionate, reflective listening — not medical advice, diagnosis, or treatment plans.
Listen deeply. Reflect back what the caregiver shares. Ask gentle, open-ended questions.
Never suggest medications or clinical interventions.
Keep responses concise (2-4 sentences typically), warm, and human.
If the user expresses serious distress, suicidal ideation, or a crisis, respond with deep empathy and gently encourage them to reach out to a professional — do not try to manage a crisis yourself.`;

export const CRISIS_KEYWORDS = [
  'suicid', 'kill myself', 'end my life', 'cant go on', "can't go on",
  'hopeless', 'no point', 'give up', 'self harm', 'hurt myself',
  'overwhelmed', 'breakdown', 'falling apart',
];

export function detectCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

export async function sendGroqMessage(
  messages: GroqMessage[]
): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.75,
      max_tokens: 256,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error: ${err}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content ?? "I'm here with you.";
}