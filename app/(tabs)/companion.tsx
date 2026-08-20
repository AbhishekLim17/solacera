import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Sparkles, Send, RotateCcw } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Radii } from '../../constants/theme';

type Role = 'bot' | 'user';
interface Message { id: string; sender: Role; content: string; time: string }

function getTime(): string {
  const d = new Date();
  const h = d.getHours() % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m} ${d.getHours() >= 12 ? 'pm' : 'am'}`;
}
function uid(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }

// ── System prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Solacera, a warm and emotionally intelligent AI companion. You talk with members of a family — parents, adult children, siblings — who may be going through stressful, emotional, or difficult situations at home.

Your personality:
- Warm, calm, and genuinely curious about what the person is feeling
- You NEVER label or categorize the person (do NOT say "as a caregiver", "I understand caregivers feel", or similar)
- You respond to what they actually said — not a template about their role
- You ask one thoughtful follow-up question per reply
- You validate their feeling first, then gently explore it
- Responses are 2–4 sentences max — natural and conversational, never clinical
- You never give medical advice or diagnoses
- You never make up facts or invent resources
- If something seems off-topic (math homework, coding, news), gently say: "I'm here to talk about whatever's on your heart — is there something weighing on you?"
- If someone sounds in serious distress or mentions self-harm, respond with care: "What you're sharing sounds really heavy. Please consider reaching out to iCall at 9152987821 — they're free and confidential."

Keep it real. Keep it human. No therapy jargon. No repeating their role back at them.`;

// ── Groq API ──────────────────────────────────────────────────────────────────
async function askGroq(history: { role: string; content: string }[]): Promise<string | null> {
  const key = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (!key || key.includes('YOUR_') || key.length < 30) {
    console.log('[Solacera] No valid key — using fallback');
    return null;
  }
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
        max_tokens: 220,
        temperature: 0.75,
        top_p: 0.9,
      }),
    });
    if (!res.ok) {
      console.error('[Solacera] Groq error:', res.status, await res.text());
      return null;
    }
    const data = await res.json();
    let reply = data.choices?.[0]?.message?.content ?? '';
    // Strip chain-of-thought thinking blocks (qwen model)
    reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    // Trim leading newlines
    reply = reply.replace(/^\n+/, '').trim();
    console.log('[Solacera] Groq OK:', reply?.slice(0, 60));
    return reply ?? null;
  } catch (e) {
    console.error('[Solacera] fetch failed:', e);
    return null;
  }
}

// ── Local fallback — natural, no role-labeling ────────────────────────────────
const FALLBACK: { match: RegExp; replies: string[] }[] = [
  {
    match: /tired|exhaust|drained|worn.?out|burnout/i,
    replies: [
      "That kind of tiredness goes deeper than just sleep — it's the weight of everything at once. What's been the hardest part lately?",
      "When you're running on empty, even small things feel impossible. How long have you been feeling this way?",
      "That's a real and valid kind of tired. What would feel like even the smallest relief right now?",
    ],
  },
  {
    match: /stress|stressed|overwhelm|too much|pressure|can.?t cope/i,
    replies: [
      "When everything stacks up, it's hard to know where to even begin. What's pressing down on you the most right now?",
      "Feeling overwhelmed usually means you've been carrying more than one person should. Is there anyone who can take even a small piece of this off you?",
      "That feeling of too-much is exhausting. What's contributing to it most — the practical stuff, the emotional load, or both?",
    ],
  },
  {
    match: /lonely|alone|isolat|no one understand|nobody understand/i,
    replies: [
      "That kind of loneliness — where you're surrounded by people but still feel unseen — is one of the heaviest feelings. Who knows what your days are actually like?",
      "Feeling alone in something this big is really hard. When's the last time someone genuinely asked how you were doing?",
      "Being unseen while giving everything you have — that's a particular kind of pain. What does a typical day look like for you?",
    ],
  },
  {
    match: /guilt|guilty|bad person|should have|shouldn.?t have|feel like I failed/i,
    replies: [
      "Guilt usually shows up loudest for the people who care most. What's making you feel this way — something specific happened?",
      "That inner critic can be really harsh. What would you say to someone you love if they felt exactly the same way you do right now?",
      "Guilt and responsibility can feel the same, but they're not. What specifically is making you feel like you fell short?",
    ],
  },
  {
    match: /angry|frustrated|resentful|resentment|rage|furious/i,
    replies: [
      "Anger usually has something underneath it — something unfair, or a need that's going unmet. What set it off today?",
      "That frustration makes sense. What's been building up for you — has it been one thing, or a lot of small things?",
      "Resentment doesn't come from nowhere. What do you think yours is trying to tell you?",
    ],
  },
  {
    match: /sad|grief|griev|cry|crying|miss them|miss him|miss her|heartbroken/i,
    replies: [
      "That sadness sounds real and deep. What's brought it up today — something specific, or has it just been sitting with you?",
      "It's okay to feel the weight of this without needing to fix it right now. What are you missing most?",
      "Grief has a way of showing up at unexpected moments. How long have you been carrying this?",
    ],
  },
  {
    match: /sleep|can.?t sleep|insomnia|not sleeping|awake at night/i,
    replies: [
      "Not sleeping makes everything — patience, clarity, resilience — so much harder. Is it that your mind won't stop, or something else keeping you up?",
      "Broken sleep takes a real toll. How long has this been going on, and what's usually running through your head at night?",
      "That's rough. Sleep deprivation changes how everything feels. Is it a person's needs waking you, or your own thoughts?",
    ],
  },
  {
    match: /wish I didn.?t|don.?t want to|can.?t do this|give up|walk away|had enough/i,
    replies: [
      "Wanting to step back from an impossible situation doesn't make you a bad person — it makes you human. What would need to change for things to feel even slightly manageable?",
      "Those feelings are worth saying out loud rather than burying. What's pushed you to this point?",
      "Feeling like you've hit a wall is a signal that something needs to shift. What would actually help right now?",
    ],
  },
  {
    match: /help|what should I do|don.?t know what to do|advice|how do I|guidance/i,
    replies: [
      "Let's think through this together. What's the situation, and what have you already tried?",
      "What's the most pressing piece right now — the practical side, or how it's making you feel?",
      "Walk me through what's going on and we can work out a next step together.",
    ],
  },
  {
    match: /^h[ae]y[\s!.]*$|^hi[\s!.]*$|^hello[\s!.]*$|good (morning|evening|afternoon|night)/i,
    replies: [
      "Hey — good to have you here. How are you actually doing today?",
      "Hi! I'm here. What's on your mind?",
      "Hello! How's everything going with you lately?",
    ],
  },
  {
    match: /thank|thanks|helped|appreciate|feel better|that.?s good/i,
    replies: [
      "Really glad that helped. Come back anytime — this space is always here for you.",
      "Of course. Take care of yourself today.",
      "Anytime. You deserve someone to talk to.",
    ],
  },
  {
    match: /okay|fine|alright|not too bad|managing/i,
    replies: [
      "Okay is sometimes the best we can say, and that's enough. Anything specific on your mind?",
      "Glad to hear that. What's been keeping you going lately?",
      "Sometimes 'okay' has a lot underneath it. Anything you want to talk through?",
    ],
  },
];

const GENERIC: string[] = [
  "Tell me more — I want to understand what you're going through before I say anything.",
  "That sounds like a lot. Can you share a bit more about what's been happening?",
  "What's weighing on you most about this right now?",
  "I want to make sure I understand properly. Can you walk me through it?",
  "What would feel most helpful — to just be heard, or to think through what to do?",
  "You don't have to figure this out alone. What's been building up lately?",
  "That matters. What do you think is at the root of how you're feeling?",
];

let _gi = 0;
function localReply(text: string): string {
  for (const f of FALLBACK) {
    if (f.match.test(text)) {
      return f.replies[Math.floor(Math.random() * f.replies.length)];
    }
  }
  const r = GENERIC[_gi % GENERIC.length];
  _gi += 1 + Math.floor(Math.random() * 2);
  return r;
}

// ── Component ─────────────────────────────────────────────────────────────────
const WELCOME = "Hi, I\u2019m here. Whatever\u2019s on your mind \u2014 big or small \u2014 you can talk to me.";

export default function CompanionScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'w', sender: 'bot', content: WELCOME, time: getTime() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(t);
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: uid(), sender: 'user', content: text, time: getTime() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    const history = next.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));

    const reply = (await askGroq(history)) ?? localReply(text);
    setMessages((prev) => [...prev, { id: uid(), sender: 'bot', content: reply, time: getTime() }]);
    setLoading(false);
  }, [input, loading, messages]);

  const newChat = () => {
    setMessages([{ id: uid(), sender: 'bot', content: WELCOME, time: getTime() }]);
    setInput('');
  };

  return (
    <View style={s.page}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.hIcon}><Sparkles size={16} color={Colors.primary} strokeWidth={1.8} /></View>
          <View>
            <Text style={s.title}>AI Companion</Text>
            <Text style={s.subtitle}>A warm, listening presence</Text>
          </View>
        </View>
        <TouchableOpacity style={s.newBtn} onPress={newChat}>
          <RotateCcw size={12} color={Colors.textSecondary} strokeWidth={2} />
          <Text style={s.newBtnText}>New chat</Text>
        </TouchableOpacity>
      </View>

      {/* Chat card */}
      <View style={s.card}>
        <ScrollView ref={scrollRef} style={s.scroll} contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {messages.map((msg) => (
            <View key={msg.id} style={[s.row, msg.sender === 'user' ? s.rowUser : s.rowBot]}>
              {msg.sender === 'bot' && (
                <View style={s.avatar}><Sparkles size={11} color={Colors.primary} strokeWidth={2} /></View>
              )}
              <View style={s.col}>
                <View style={[s.bubble, msg.sender === 'user' ? s.bubbleUser : s.bubbleBot]}>
                  <Text style={[s.bubbleText, msg.sender === 'user' ? s.textUser : s.textBot]}>
                    {msg.content}
                  </Text>
                </View>
                <Text style={[s.ts, msg.sender === 'user' ? s.tsR : s.tsL]}>{msg.time}</Text>
              </View>
            </View>
          ))}
          {loading && (
            <View style={[s.row, s.rowBot]}>
              <View style={s.avatar}><Sparkles size={11} color={Colors.primary} strokeWidth={2} /></View>
              <View style={[s.bubble, s.bubbleBot, { paddingVertical: 14 }]}>
                <View style={s.dots}>
                  {[0, 180, 360].map((d) => <Dot key={d} delay={d} />)}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={s.inputRow}>
          <TextInput
            style={s.input} value={input} onChangeText={setInput}
            placeholder="Type how you're feeling..." placeholderTextColor={Colors.textMuted}
            multiline maxLength={600} returnKeyType="send" blurOnSubmit={false}
            onSubmitEditing={send}
          />
          <TouchableOpacity style={[s.sendBtn, (!input.trim() || loading) && s.sendOff]}
            onPress={send} disabled={!input.trim() || loading} activeOpacity={0.75}>
            <Send size={14} color={Colors.white} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={s.disclaimer}>
        {'\u24D8'}{'  '}Solacera is for emotional companionship and general support. It does not replace qualified professional help or medical advice.
      </Text>
    </View>
  );
}

function Dot({ delay }: { delay: number }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => {
      const iv = setInterval(() => setOn((v) => !v), 550);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);
  return <View style={[s.dot, { opacity: on ? 1 : 0.2 }]} />;
}

const s = StyleSheet.create({
  page: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  hIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  title: { fontFamily: FontFamily.sansSemiBold, fontSize: FontSize.xl, color: Colors.primary },
  subtitle: { fontFamily: FontFamily.sans, fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  newBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: Colors.border, borderRadius: Radii.pill, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: Colors.surface },
  newBtnText: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.xs, color: Colors.textSecondary },
  card: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radii.xl, borderWidth: 1, borderColor: '#e8e4d8', overflow: 'hidden', minHeight: 380 },
  scroll: { flex: 1 },
  scrollContent: { padding: 18, paddingBottom: 8, gap: 4, flexGrow: 1 },
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
  rowUser: { justifyContent: 'flex-end' },
  rowBot: { justifyContent: 'flex-start', gap: 8 },
  col: { maxWidth: '76%' },
  avatar: { width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.primaryLight, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble: { borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14 },
  bubbleBot: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: '#e4e0d8' },
  bubbleUser: { backgroundColor: '#2e4a32' },
  bubbleText: { fontFamily: FontFamily.sans, fontSize: FontSize.sm, lineHeight: 21 },
  textBot: { color: Colors.textPrimary },
  textUser: { color: '#f4f1ea' },
  ts: { fontFamily: FontFamily.sans, fontSize: 10, color: Colors.textMuted, marginTop: 3 },
  tsL: { textAlign: 'left', marginLeft: 2 },
  tsR: { textAlign: 'right', marginRight: 2 },
  dots: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.textMuted },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.surface },
  input: { flex: 1, minHeight: 42, maxHeight: 110, borderRadius: Radii.pill, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 10, fontFamily: FontFamily.sans, fontSize: FontSize.sm, color: Colors.textPrimary, backgroundColor: Colors.pageBg },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendOff: { opacity: 0.3 },
  disclaimer: { fontFamily: FontFamily.sans, fontSize: 10, color: Colors.textMuted, textAlign: 'center', marginTop: 10, lineHeight: 14 },
});