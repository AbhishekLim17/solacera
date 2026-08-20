import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, Platform } from 'react-native';
import { Plus, Trash2, Pencil, Check, Users, Calendar, UserRound, X } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Spacing, Radii } from '../../constants/theme';

const ASSIGNEE_COLORS: Record<string, { bg: string; text: string }> = {
  Mom:     { bg: '#fde8ee', text: '#c0516e' },
  Dad:     { bg: '#deeaf8', text: '#3a6fa0' },
  Sister:  { bg: '#fde8dc', text: '#b05a30' },
  Brother: { bg: '#e8f0e8', text: '#3a6040' },
  Grandma: { bg: '#fdeeda', text: '#a07030' },
  Grandpa: { bg: '#e8e4f5', text: '#6050a0' },
};

const MEMBERS = ['Mom', 'Dad', 'Sister', 'Brother', 'Grandma', 'Grandpa'];

interface Task {
  id: string; title: string; description?: string;
  assignee?: string; date?: string; status: 'pending' | 'completed';
}

let idCounter = 10;

const DEMO_TASKS: Task[] = [
  { id: '1', title: 'Morning walk with Grandma', description: 'A short 20-minute walk in the park.', assignee: 'Sister', date: '19 Aug, 7:30 am', status: 'pending' },
  { id: '2', title: 'Pick up prescription', description: 'From the pharmacy on 5th street before they close.', assignee: 'Dad', date: '19 Aug, 4:30 pm', status: 'pending' },
  { id: '3', title: 'Prepare lunch', description: 'Light, low-salt meal — she prefers rice and dal.', assignee: 'Mom', date: '19 Aug, 12:00 pm', status: 'completed' },
];

export default function FamilyScreen() {
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssignee, setNewAssignee] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');

  const pending = tasks.filter((t) => t.status === 'pending');
  const completed = tasks.filter((t) => t.status === 'completed');

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
  };

  const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const createTask = () => {
    if (!newTitle.trim()) return;
    setTasks((prev) => [...prev, { id: String(++idCounter), title: newTitle.trim(), description: newDesc.trim() || undefined, assignee: newAssignee ?? undefined, date: newDate.trim() || undefined, status: 'pending' }]);
    setNewTitle(''); setNewDesc(''); setNewAssignee(null); setNewDate('');
    setShowModal(false);
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const ac = ASSIGNEE_COLORS[task.assignee ?? ''];
    const done = task.status === 'completed';
    return (
      <View style={[styles.taskCard, done && styles.taskCardDone]}>
        <TouchableOpacity style={[styles.taskCheck, done && styles.taskCheckDone]} onPress={() => toggleTask(task.id)}>
          {done && <Check size={11} color={Colors.white} strokeWidth={2.5} />}
        </TouchableOpacity>
        <View style={styles.taskBody}>
          <Text style={[styles.taskTitle, done && styles.taskTitleDone]}>{task.title}</Text>
          {task.description ? <Text style={[styles.taskDesc, done && styles.taskDescDone]}>{task.description}</Text> : null}
          <View style={styles.taskMeta}>
            {task.assignee && ac ? (
              <View style={[styles.assigneePill, { backgroundColor: ac.bg }]}>
                <UserRound size={9} color={ac.text} strokeWidth={2} />
                <Text style={[styles.assigneeText, { color: ac.text }]}>{task.assignee}</Text>
              </View>
            ) : null}
            {task.date ? (
              <View style={styles.datePill}>
                <Calendar size={9} color={Colors.textMuted} strokeWidth={2} />
                <Text style={styles.datePillText}>{task.date}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.taskActions}>
          <TouchableOpacity hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Pencil size={14} color={Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTask(task.id)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
            <Trash2 size={14} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Users size={16} color={Colors.primary} strokeWidth={1.6} />
          </View>
          <View>
            <Text style={styles.title}>Family Coordination</Text>
            <Text style={styles.subtitle}>Share the caregiving, together</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Plus size={13} color={Colors.white} strokeWidth={2.5} />
          <Text style={styles.addBtnText}>New task</Text>
        </TouchableOpacity>
      </View>

      {/* Pending */}
      <Text style={styles.groupLabel}>Pending <Text style={styles.groupCount}>({pending.length})</Text></Text>
      {pending.length === 0 && <Text style={styles.empty}>No pending tasks. Great work!</Text>}
      {pending.map((t) => <TaskCard key={t.id} task={t} />)}

      {/* Completed */}
      {completed.length > 0 && (
        <>
          <Text style={[styles.groupLabel, { marginTop: 24 }]}>Completed <Text style={styles.groupCount}>({completed.length})</Text></Text>
          {completed.map((t) => <TaskCard key={t.id} task={t} />)}
        </>
      )}

      {/* Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New caregiving task</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalLabel}>Task title</Text>
            <TextInput style={styles.modalInput} value={newTitle} onChangeText={setNewTitle} placeholder="e.g. Pick up prescription" placeholderTextColor={Colors.textMuted} />
            <Text style={styles.modalLabel}>Description <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput style={[styles.modalInput, { height: 80 }]} value={newDesc} onChangeText={setNewDesc} placeholder="Any details the family member should know..." placeholderTextColor={Colors.textMuted} multiline textAlignVertical="top" />
            <Text style={styles.modalLabel}>Assign to</Text>
            <View style={styles.assigneeRow}>
              {MEMBERS.map((m) => {
                const ac = ASSIGNEE_COLORS[m];
                const sel = newAssignee === m;
                return (
                  <TouchableOpacity key={m} style={[styles.assigneeBadge, { backgroundColor: sel ? ac.text : ac.bg }]} onPress={() => setNewAssignee(sel ? null : m)}>
                    <Text style={[styles.assigneeBadgeText, { color: sel ? Colors.white : ac.text }]}>{m}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.modalLabel}>Date & time</Text>
            <View style={styles.dateRow}>
              <TextInput style={[styles.modalInput, { flex: 1 }]} value={newDate} onChangeText={setNewDate} placeholder="19-08-2026 14:30" placeholderTextColor={Colors.textMuted} />
              <Calendar size={16} color={Colors.textMuted} style={{ marginLeft: 8, marginTop: 10 }} />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.createBtn} onPress={createTask}>
                <Text style={styles.createBtnText}>Create task</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: FontFamily.sansSemiBold, fontSize: FontSize.xl, color: Colors.primary },
  subtitle: { fontFamily: FontFamily.sans, fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary, borderRadius: Radii.pill, paddingHorizontal: 14, paddingVertical: 8 },
  addBtnText: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm, color: Colors.white },
  groupLabel: { fontFamily: FontFamily.serif, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: 10 },
  groupCount: { fontFamily: FontFamily.sans, color: Colors.textMuted },
  empty: { fontFamily: FontFamily.sans, fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: 12 },
  taskCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: Colors.surface, borderRadius: Radii.lg, padding: 16, borderWidth: 1, borderColor: '#e8e4d8', marginBottom: 10 },
  taskCardDone: { opacity: 0.65 },
  taskCheck: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#c8c4b8', alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 },
  taskCheckDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  taskBody: { flex: 1 },
  taskTitle: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.base, color: Colors.textPrimary },
  taskTitleDone: { textDecorationLine: 'line-through', color: Colors.textMuted },
  taskDesc: { fontFamily: FontFamily.sans, fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2, lineHeight: 16 },
  taskDescDone: { color: Colors.textMuted },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  assigneePill: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radii.pill },
  assigneeText: { fontFamily: FontFamily.sansMedium, fontSize: 11 },
  datePill: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radii.pill, backgroundColor: Colors.pageBg, borderWidth: 1, borderColor: Colors.border },
  datePillText: { fontFamily: FontFamily.sans, fontSize: 11, color: Colors.textMuted },
  taskActions: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingTop: 2 },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  modalBox: { backgroundColor: Colors.surface, borderRadius: Radii.xl, padding: 24, width: 420, maxWidth: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.lg, color: Colors.textPrimary },
  modalLabel: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm, color: Colors.textPrimary, marginBottom: 4, marginTop: 12 },
  optional: { fontFamily: FontFamily.sans, color: Colors.textMuted, fontWeight: 'normal' },
  modalInput: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radii.md, paddingHorizontal: 12, height: 42, fontFamily: FontFamily.sans, fontSize: FontSize.sm, color: Colors.textPrimary, backgroundColor: Colors.surface },
  assigneeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 2 },
  assigneeBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radii.pill },
  assigneeBadgeText: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  createBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: Radii.pill, paddingVertical: 11, alignItems: 'center' },
  createBtnText: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.base, color: Colors.white },
  cancelBtn: { flex: 1, borderRadius: Radii.pill, paddingVertical: 11, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  cancelBtnText: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.base, color: Colors.textPrimary },
});