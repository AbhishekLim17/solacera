import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Task {
  id: string;
  household_id: string;
  created_by: string;
  title: string;
  description?: string;
  assignee_name?: string;
  due_datetime?: string;
  status: 'pending' | 'completed';
  created_at: string;
}

export function useTasks(householdId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!householdId) return;
    setLoading(true);
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('household_id', householdId)
      .order('created_at', { ascending: false });
    setTasks(data ?? []);
    setLoading(false);
  }, [householdId]);

  useEffect(() => {
    fetchTasks();
    if (!householdId) return;
    const channel = supabase
      .channel('tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `household_id=eq.${householdId}` }, fetchTasks)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [householdId, fetchTasks]);

  const addTask = async (payload: Omit<Task, 'id' | 'status' | 'created_at'>) => {
    const { error } = await supabase.from('tasks').insert({ ...payload, status: 'pending' });
    if (error) throw error;
    await fetchTasks();
  };

  const toggleTask = async (id: string, status: 'pending' | 'completed') => {
    const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
    if (error) throw error;
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase.from('tasks').update(updates).eq('id', id);
    if (error) throw error;
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, ...updates } : t));
  };

  return { tasks, loading, addTask, toggleTask, deleteTask, updateTask, refetch: fetchTasks };
}