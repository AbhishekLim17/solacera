import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Sparkles, BookOpen, Wind, Music, Leaf, Play, RotateCcw } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Spacing, Radii } from '../../constants/theme';

type ActivityType = 'Quiet Time' | 'Reading' | 'Breathing' | 'Music' | 'Relaxation';

const ACTIVITIES: { type: ActivityType; desc: string; Icon: any; iconColor: string; iconBg: string }[] = [
  { type: 'Quiet Time', desc: 'Sit in stillness and let your mind rest.',  Icon: Sparkles, iconColor: Colors.primary,  iconBg: Colors.primaryLight },
  { type: 'Reading',    desc: 'Lose yourself in a few pages.',              Icon: BookOpen, iconColor: '#a07040',       iconBg: '#f5ede0' },
  { type: 'Breathing',  desc: 'Slow breaths in, slow breaths out.',         Icon: Wind,     iconColor: '#3a88a0',       iconBg: '#e0f0f5' },
  { type: 'Music',      desc: "Let a calming song carry you.",              Icon: Music,    iconColor: '#7a60c0',       iconBg: '#f0ecf8' },
  { type: 'Relaxation', desc: 'Unclench, soften, release.',                 Icon: Leaf,     iconColor: '#409a70',       iconBg: '#e0f5ec' },
];

const DURATIONS = [3, 5, 10, 15, 20];

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function SolaceScreen() {
  const [activity, setActivity] = useState<ActivityType | null>(null);
  const [duration, setDuration] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeCfg = ACTIVITIES.find((a) => a.type === activity);

  const pickActivity = (type: ActivityType) => {
    setActivity(type);
    setRunning(false);
    setDone(false);
    setSecondsLeft(duration * 60);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const pickDuration = (d: number) => {
    setDuration(d);
    setSecondsLeft(d * 60);
    setRunning(false);
    setDone(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const start = () => {
    if (done || !activity) return;
    setRunning(true);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setRunning(false);
          setDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    setDone(false);
    setSecondsLeft(duration * 60);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Sparkles size={16} color="#c07a40" strokeWidth={1.6} />
        </View>
        <View>
          <Text style={styles.title}>Solace Time</Text>
          <Text style={styles.subtitle}>A few moments just for you</Text>
        </View>
      </View>

      {/* Activity grid */}
      <Text style={styles.sectionLabel}>Choose an activity</Text>
      <View style={styles.activityGrid}>
        {ACTIVITIES.map(({ type, desc, Icon, iconColor, iconBg }) => {
          const sel = activity === type;
          return (
            <TouchableOpacity
              key={type}
              style={[styles.actCard, sel && { borderColor: Colors.primary }]}
              onPress={() => pickActivity(type)}
              activeOpacity={0.8}
            >
              <View style={[styles.actIcon, { backgroundColor: iconBg }]}>
                <Icon size={18} color={iconColor} strokeWidth={1.8} />
              </View>
              <Text style={[styles.actName, sel && { color: Colors.primary }]}>{type}</Text>
              <Text style={styles.actDesc}>{desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Duration pills */}
      <Text style={styles.sectionLabel}>Pick a duration</Text>
      <View style={styles.durationRow}>
        {DURATIONS.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.durationPill, duration === d && styles.durationPillSel]}
            onPress={() => pickDuration(d)}
          >
            <Text style={[styles.durationText, duration === d && styles.durationTextSel]}>{d} min</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer card */}
      <View style={styles.timerCard}>
        {activity ? (
          <>
            <View style={styles.actBadge}>
              {activeCfg && <activeCfg.Icon size={11} color={Colors.primary} strokeWidth={2} />}
              <Text style={styles.actBadgeText}>{activity}</Text>
            </View>
            <View style={styles.timerCircle}>
              <Text style={styles.timerText}>{fmt(secondsLeft)}</Text>
              <Text style={styles.timerStatus}>{done ? 'done!' : running ? 'in progress' : 'ready'}</Text>
            </View>
            <View style={styles.timerActions}>
              <TouchableOpacity style={[styles.startBtn, (running || done) && { opacity: 0.4 }]} onPress={start} disabled={running || done}>
                <Play size={14} color={Colors.white} fill={Colors.white} />
                <Text style={styles.startBtnText}>{done ? 'Done!' : 'Start'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resetBtn} onPress={reset}>
                <RotateCcw size={14} color={Colors.primary} />
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.actIcon, { backgroundColor: Colors.primaryLight, width: 48, height: 48, borderRadius: 24, marginBottom: 12 }]}>
              <Sparkles size={22} color={Colors.primary} strokeWidth={1.6} />
            </View>
            <Text style={styles.placeholderTitle}>Pick an activity above to begin</Text>
            <Text style={styles.placeholderSub}>Even three minutes can shift your whole day.</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fdf0e6', borderWidth: 1, borderColor: '#f0d8c0', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: FontFamily.sansSemiBold, fontSize: FontSize.xl, color: Colors.textPrimary },
  subtitle: { fontFamily: FontFamily.sans, fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  sectionLabel: { fontFamily: FontFamily.serif, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: 10 },
  activityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  actCard: { width: '31%', backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: 14, borderWidth: 1.5, borderColor: Colors.border, minHeight: 110 },
  actIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actName: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm, color: Colors.textPrimary, marginBottom: 2 },
  actDesc: { fontFamily: FontFamily.sans, fontSize: 11, color: Colors.textMuted, lineHeight: 14 },
  durationRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
  durationPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radii.pill, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface },
  durationPillSel: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  durationText: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm, color: Colors.textSecondary },
  durationTextSel: { color: Colors.white },
  timerCard: { backgroundColor: Colors.surface, borderRadius: Radii.xl, padding: 32, borderWidth: 1, borderColor: '#e8e4d8', alignItems: 'center', gap: 16 },
  actBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primaryLight, borderRadius: Radii.pill, paddingHorizontal: 12, paddingVertical: 4 },
  actBadgeText: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.xs, color: Colors.primary },
  timerCircle: { width: 160, height: 160, borderRadius: 80, borderWidth: 8, borderColor: '#e8e4d8', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.pageBg },
  timerText: { fontFamily: FontFamily.serif, fontSize: 40, color: Colors.textPrimary },
  timerStatus: { fontFamily: FontFamily.sans, fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  timerActions: { flexDirection: 'row', gap: 10 },
  startBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary, borderRadius: Radii.pill, paddingHorizontal: 22, paddingVertical: 11 },
  startBtnText: { fontFamily: FontFamily.sansSemiBold, fontSize: FontSize.base, color: Colors.white },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radii.pill, paddingHorizontal: 18, paddingVertical: 11 },
  resetBtnText: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.base, color: Colors.textPrimary },
  placeholderTitle: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.base, color: Colors.textPrimary, textAlign: 'center' },
  placeholderSub: { fontFamily: FontFamily.sans, fontSize: FontSize.sm, color: Colors.primary, textAlign: 'center' },
});