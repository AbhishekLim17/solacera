import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { supabase } from '../lib/supabase';

export type ActivityType = 'Quiet Time' | 'Reading' | 'Breathing' | 'Music' | 'Relaxation';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'done';

export function useSolace(userId: string | null) {
  const [activity, setActivity] = useState<ActivityType>('Quiet Time');
  const [durationMin, setDurationMin] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    setSecondsLeft(durationMin * 60);
    setStatus('idle');
    clearInterval(intervalRef.current!);
  }, [durationMin, activity]);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = useCallback(() => {
    if (status === 'running') return;
    const now = new Date().toISOString();
    setStartedAt(now);
    setStatus('running');
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setStatus('done');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [status]);

  const reset = useCallback(() => {
    clearTimer();
    setSecondsLeft(durationMin * 60);
    setStatus('idle');
    setStartedAt(null);
  }, [durationMin]);

  // Log completed session to Supabase
  useEffect(() => {
    if (status === 'done' && userId && startedAt) {
      supabase.from('solace_sessions').insert({
        user_id: userId,
        activity_type: activity,
        duration_minutes: durationMin,
        started_at: startedAt,
        completed_at: new Date().toISOString(),
      });
    }
  }, [status, userId, activity, durationMin, startedAt]);

  // Handle app backgrounding — pause timer
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (appStateRef.current === 'active' && nextState.match(/inactive|background/)) {
        clearTimer();
        if (status === 'running') setStatus('paused');
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, [status]);

  return { activity, setActivity, durationMin, setDurationMin, secondsLeft, status, start, reset };
}