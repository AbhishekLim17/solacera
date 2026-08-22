import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Pill, Droplet, Moon, Activity, Trash2 } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Spacing, Radii } from '../../constants/theme';
import { useBreakpoint } from '../../hooks/useBreakpoint';

type ReminderType = 'medicine' | 'hydration' | 'sleep' | 'activity';

interface Reminder {
  id: string; type: ReminderType; name: string; time: string; completed: boolean;
}

const WELLNESS_CATS = [
  { type: 'hydration' as ReminderType, label: 'Hydration',  Icon: Droplet,   color: '#4e8ea0', bg: '#e8f4f8' },
  { type: 'sleep'     as ReminderType, label: 'Sleep / Rest', Icon: Moon,    color: '#7a6dbf', bg: '#f0eef8' },
  { type: 'activity'  as ReminderType, label: 'Activity',   Icon: Activity,  color: '#5d9461', bg: '#eef5ee' },
];

const TYPE_ICON: Record<ReminderType, any> = { medicine: Pill, hydration: Droplet, sleep: Moon, activity: Activity };
const TYPE_COLOR: Record<ReminderType, string> = { medicine: Colors.primary, hydration: '#4e8ea0', sleep: '#7a6dbf', activity: '#5d9461' };

let idCounter = 100;

export default function WellnessScreen() {
  const { isMobile } = useBreakpoint();
  const [tab, setTab] = useState<'medicine' | 'wellness'>('medicine');
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', type: 'medicine', name: 'Vitamin D', time: '08:30', completed: false },
    { id: '2', type: 'medicine', name: 'Blood pressure tablet', time: '13:00', completed: false },
    { id: '3', type: 'medicine', name: 'Calcium supplement', time: '20:00', completed: false },
    { id: '4', type: 'hydration', name: 'Drink a glass of water', time: '10:00', completed: false },
    { id: '5', type: 'activity', name: '5-minute stretch', time: '16:00', completed: false },
    { id: '6', type: 'sleep', name: 'Wind down for the night', time: '22:00', completed: false },
  ]);

  // Medicine form
  const [medName, setMedName] = useState('');
  const [medTime, setMedTime] = useState('');

  // Wellness form
  const [wellCat, setWellCat] = useState<ReminderType>('hydration');
  const [wellDesc, setWellDesc] = useState('');
  const [wellTime, setWellTime] = useState('');

  const addMedicine = () => {
    if (!medName.trim()) return;
    setReminders((prev) => [...prev, { id: String(++idCounter), type: 'medicine', name: medName.trim(), time: medTime || '--:--', completed: false }]);
    setMedName(''); setMedTime('');
  };

  const addWellness = () => {
    if (!wellDesc.trim()) return;
    setReminders((prev) => [...prev, { id: String(++idCounter), type: wellCat, name: wellDesc.trim(), time: wellTime || '--:--', completed: false }]);
    setWellDesc(''); setWellTime('');
  };

  const toggle = (id: string) => setReminders((prev) => prev.map((r) => r.id === id ? { ...r, completed: !r.completed } : r));
  const remove = (id: string) => setReminders((prev) => prev.filter((r) => r.id !== id));

  const medReminders = reminders.filter((r) => r.type === 'medicine');
  const wellReminders = reminders.filter((r) => r.type !== 'medicine');

  const ReminderRow = ({ r }: { r: Reminder }) => {
    const Icon = TYPE_ICON[r.type];
    const color = TYPE_COLOR[r.type];
    return (
      <View style={styles.remRow}>
        <TouchableOpacity style={[styles.circle, r.completed && styles.circleChecked]} onPress={() => toggle(r.id)} />
        <View style={[styles.remIconCircle, { backgroundColor: color + '22' }]}>
          <Icon size={13} color={color} strokeWidth={2} />
        </View>
        <View style={styles.remInfo}>
          <Text style={[styles.remName, r.completed && styles.strikethrough]}>{r.name}</Text>
          <Text style={styles.remTime}>{r.time}</Text>
        </View>
        <TouchableOpacity onPress={() => remove(r.id)}>
          <Trash2 size={15} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Text style={{ fontSize: 14 }}>{String.fromCodePoint(0x1F9E1)}</Text>
          </View>
          <View>
            <Text style={styles.title}>Personal Wellness</Text>
            <Text style={styles.subtitle}>Gentle reminders to care for yourself too</Text>
          </View>
        </View>
      </View>

      {/* Tab pills */}
      <View style={styles.tabRow}>
        {(['medicine', 'wellness'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabPill, tab === t && styles.tabPillActive]}
            onPress={() => setTab(t)}
          >
            {t === 'medicine' ? <Pill size={12} color={tab === t ? Colors.textPrimary : Colors.textMuted} /> : <Activity size={12} color={tab === t ? Colors.textPrimary : Colors.textMuted} />}
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === 'medicine' ? 'Medicine' : 'Wellness'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Medicine tab */}
      {tab === 'medicine' && (
        <>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add a medicine reminder</Text>
            <View style={[styles.twoCol, isMobile && styles.twoColMobile]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Medicine name</Text>
                <TextInput style={styles.fieldInput} value={medName} onChangeText={setMedName} placeholder="e.g. Vitamin D" placeholderTextColor={Colors.textMuted} />
              </View>
              <View style={isMobile ? { width: "100%" } : { width: 160 }}>
                <Text style={styles.fieldLabel}>Time</Text>
                <TextInput style={styles.fieldInput} value={medTime} onChangeText={setMedTime} placeholder="--:--" placeholderTextColor={Colors.textMuted} />
              </View>
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={addMedicine}>
              <Text style={styles.saveBtnText}>+ Save reminder</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.listTitle}>Your reminders</Text>
          <View style={styles.listCard}>
            {medReminders.length === 0 ? <Text style={styles.empty}>No medicine reminders yet.</Text> : medReminders.map((r, i) => <View key={r.id}>{i > 0 && <View style={styles.divider} />}<ReminderRow r={r} /></View>)}
          </View>
        </>
      )}

      {/* Wellness tab */}
      {tab === 'wellness' && (
        <>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add a wellness reminder</Text>
            <View style={[styles.catGrid, isMobile && styles.catGridMobile]}>
              {WELLNESS_CATS.map((c) => {
                const sel = wellCat === c.type;
                return (
                  <TouchableOpacity
                    key={c.type}
                    style={[styles.catCard, sel && { borderColor: c.color, backgroundColor: c.bg }]}
                    onPress={() => setWellCat(c.type)}
                    activeOpacity={0.8}
                  >
                    <c.Icon size={16} color={sel ? c.color : Colors.textMuted} strokeWidth={2} />
                    <Text style={[styles.catLabel, sel && { color: c.color }]}>{c.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={[styles.twoCol, isMobile && styles.twoColMobile]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>What to do</Text>
                <TextInput style={styles.fieldInput} value={wellDesc} onChangeText={setWellDesc} placeholder="e.g. Drink a glass of water" placeholderTextColor={Colors.textMuted} />
              </View>
              <View style={isMobile ? { width: "100%" } : { width: 160 }}>
                <Text style={styles.fieldLabel}>Time</Text>
                <TextInput style={styles.fieldInput} value={wellTime} onChangeText={setWellTime} placeholder="--:--" placeholderTextColor={Colors.textMuted} />
              </View>
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={addWellness}>
              <Text style={styles.saveBtnText}>+ Save reminder</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.listTitle}>Your wellness reminders</Text>
          <View style={styles.listCard}>
            {wellReminders.length === 0 ? <Text style={styles.empty}>No wellness reminders yet.</Text> : wellReminders.map((r, i) => <View key={r.id}>{i > 0 && <View style={styles.divider} />}<ReminderRow r={r} /></View>)}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  header: { marginBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fdf0e6', borderWidth: 1, borderColor: '#f0d8c0', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: FontFamily.sansSemiBold, fontSize: FontSize.xl, color: Colors.primary },
  subtitle: { fontFamily: FontFamily.sans, fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  tabRow: { flexDirection: 'row', gap: 4, marginBottom: 20 },
  tabPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radii.pill, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: 'transparent' },
  tabPillActive: { backgroundColor: Colors.surface, borderColor: '#c8c4b8' },
  tabText: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm, color: Colors.textMuted },
  tabTextActive: { color: Colors.textPrimary },
  formCard: { backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: 20, borderWidth: 1, borderColor: '#e8e4d8', marginBottom: 20 },
  formTitle: { fontFamily: FontFamily.sans, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: 14 },
  twoCol: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  fieldLabel: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm, color: Colors.textPrimary, marginBottom: 4 },
  fieldInput: { height: 42, borderRadius: Radii.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, fontFamily: FontFamily.sans, fontSize: FontSize.sm, color: Colors.textPrimary, backgroundColor: Colors.surface },
  catGrid: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  catCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', paddingVertical: 10, borderRadius: Radii.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface },
  catLabel: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm, color: Colors.textMuted },
  saveBtn: { backgroundColor: Colors.primary, borderRadius: Radii.pill, paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'flex-start' },
  saveBtnText: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm, color: Colors.white },
  listTitle: { fontFamily: FontFamily.serif, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: 10 },
  listCard: { backgroundColor: Colors.surface, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#e8e4d8', paddingHorizontal: 18, paddingVertical: 4 },
  divider: { height: 1, backgroundColor: '#f0ede4' },
  remRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 10 },
  circle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#c8c4b8', flexShrink: 0 },
  circleChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  remIconCircle: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  remInfo: { flex: 1 },
  remName: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm, color: Colors.textPrimary },
  strikethrough: { textDecorationLine: 'line-through', color: Colors.textMuted },
  remTime: { fontFamily: FontFamily.sans, fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  empty: { fontFamily: FontFamily.sans, fontSize: FontSize.sm, color: Colors.textMuted, paddingVertical: 14 },
  twoColMobile: { flexDirection: 'column' },
  catGridMobile: { flexWrap: 'wrap' },
});
