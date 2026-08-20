import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { sendGroqMessage, detectCrisis, GroqMessage } from '../lib/groq';

export interface ChatMsg {
  id: string;
  conversation_id: string;
  sender: 'user' | 'bot';
  content: string;
  created_at: string;
}

export function useCompanion(userId: string | null) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);

  const startNewChat = useCallback(async () => {
    const newId = crypto.randomUUID();
    setConversationId(newId);
    setMessages([]);
    setShowCrisis(false);

    const welcome: ChatMsg = {
      id: crypto.randomUUID(),
      conversation_id: newId,
      sender: 'bot',
      content: "Hi, I'm here. Whatever's on your mind today — big or small — you can talk to me.",
      created_at: new Date().toISOString(),
    };
    setMessages([welcome]);
    if (userId) {
      await supabase.from('chat_messages').insert({ user_id: userId, ...welcome });
    }
  }, [userId]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !conversationId) return;
    setLoading(true);

    const crisis = detectCrisis(text);
    if (crisis) setShowCrisis(true);

    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      sender: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    if (userId) await supabase.from('chat_messages').insert({ user_id: userId, ...userMsg });

    try {
      const history: GroqMessage[] = messages
        .concat(userMsg)
        .map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.content }));

      const reply = await sendGroqMessage(history);
      const botMsg: ChatMsg = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        sender: 'bot',
        content: reply,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      if (userId) await supabase.from('chat_messages').insert({ user_id: userId, ...botMsg });
    } catch {
      const errMsg: ChatMsg = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        sender: 'bot',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }, [conversationId, messages, userId]);

  return { messages, loading, showCrisis, startNewChat, sendMessage };
}