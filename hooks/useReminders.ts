import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type ReminderType = 'medicine' | 'hydration' | 'sleep' | 'activity';

export interface Reminder {
  id: string;
  household_id: string;
  created_by: string;
  type: ReminderType;
  name: string;
  reminder_time: string; // "HH:MM:SS"
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export function useReminders(householdId: string | null) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    if (!householdId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('household_id', householdId)
      .order('reminder_time', { ascending: true });
    if (error) setError(error.message);
    else setReminders(data ?? []);
    setLoading(false);
  }, [householdId]);

  useEffect(() => {
    fetchReminders();

    if (!householdId) return;
    const channel = supabase
      .channel('reminders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reminders', filter: `household_id=eq.${householdId}` }, fetchReminders)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [householdId, fetchReminders]);

  const addReminder = async (payload: Omit<Reminder, 'id' | 'completed' | 'completed_at' | 'created_at'>) => {
    const { error } = await supabase.from('reminders').insert(payload);
    if (error) throw error;
    await fetchReminders();
  };

  const toggleReminder = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('reminders')
      .update({ completed, completed_at: completed ? new Date().toISOString() : null })
      .eq('id', id);
    if (error) throw error;
    setReminders((prev) => prev.map((r) => r.id === id ? { ...r, completed, completed_at: completed ? new Date().toISOString() : null } : r));
  };

  const deleteReminder = async (id: string) => {
    const { error } = await supabase.from('reminders').delete().eq('id', id);
    if (error) throw error;
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return { reminders, loading, error, addReminder, toggleReminder, deleteReminder, refetch: fetchReminders };
}