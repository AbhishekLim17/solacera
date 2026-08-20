import React, { useState, forwardRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Platform, Alert,
} from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { X, Calendar } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Spacing, Radii } from '../../constants/theme';
import { Button } from '../ui/Button';

// Assignee colors matching reference screenshots
const ASSIGNEE_COLORS: Record<string, { bg: string; text: string; selectedBg: string }> = {
  Mom:     { bg: '#fde8ee', text: '#c0516e', selectedBg: '#e8a0b0' },
  Dad:     { bg: '#deeaf8', text: '#3a6fa0', selectedBg: '#90b8d8' },
  Sister:  { bg: '#fde8dc', text: '#b05a30', selectedBg: '#e0a080' },
  Brother: { bg: '#e8f0e8', text: '#3a6040', selectedBg: '#90b8a0' },
  Grandma: { bg: '#fdeeda', text: '#a07030', selectedBg: '#d8b070' },
  Grandpa: { bg: '#e8e4f5', text: '#6050a0', selectedBg: '#b0a0d0' },
  default: { bg: '#e8eef0', text: '#405060', selectedBg: '#90aab0' },
};

function formatDisplayDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy} ${h}:${min}`;
}

interface Props {
  members: string[];
  onSave: (task: {
    title: string;
    description?: string;
    assignee_name?: string;
    due_datetime?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

const NewTaskSheet = forwardRef<BottomSheet, Props>(({ members, onSave, onCancel }, ref) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [assignee, setAssignee] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const snapPoints = ['90%'];

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Please enter a task title'); return; }
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: desc.trim() || undefined,
        assignee_name: assignee ?? undefined,
        due_datetime: dueDate.toISOString(),
      });
      setTitle(''); setDesc(''); setAssignee(null); setDueDate(new Date());
    } catch (e: any) { Alert.alert('Error', e.message); }
    setSaving(false);
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={styles.sheet}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Title row */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>New caregiving task</Text>
          <TouchableOpacity onPress={onCancel} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <X size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Task title */}
        <Text style={styles.label}>Task title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Pick up prescription"
          placeholderTextColor={Colors.textMuted}
        />

        {/* Description */}
        <Text style={styles.label}>Description <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={desc}
          onChangeText={setDesc}
          placeholder="Any details the family member should know..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Assign to */}
        <Text style={styles.label}>Assign to</Text>
        <View style={styles.assigneeRow}>
          {members.map((m) => {
            const ac = ASSIGNEE_COLORS[m] ?? ASSIGNEE_COLORS.default;
            const sel = assignee === m;
            return (
              <TouchableOpacity
                key={m}
                style={[
                  styles.assigneePill,
                  { backgroundColor: sel ? ac.selectedBg : ac.bg },
                ]}
                onPress={() => setAssignee(sel ? null : m)}
              >
                <Text style={[styles.assigneeText, { color: sel ? Colors.white : ac.text }]}>
                  {m}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Date & time */}
        <Text style={styles.label}>Date & time</Text>
        <TouchableOpacity style={styles.dateField} onPress={() => setShowPicker(true)}>
          <Text style={styles.dateValue}>{formatDisplayDate(dueDate)}</Text>
          <Calendar size={16} color={Colors.textMuted} />
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={dueDate}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, d) => { setShowPicker(Platform.OS === 'ios'); if (d) setDueDate(d); }}
          />
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button label="Create task" onPress={handleSave} loading={saving} style={{ flex: 1 }} />
          <Button label="Cancel" variant="outlined" onPress={onCancel} style={{ flex: 1 }} />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export { NewTaskSheet };

const styles = StyleSheet.create({
  sheet: { backgroundColor: Colors.surface },
  handle: { backgroundColor: Colors.border, width: 40 },
  content: { padding: Spacing.lg, paddingBottom: Spacing['3xl'] },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  title: { fontFamily: FontFamily.sans, fontSize: FontSize.lg, color: Colors.textPrimary, fontWeight: '500' },
  label: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm, color: Colors.textPrimary, marginBottom: Spacing.xs, marginTop: Spacing.base },
  optional: { fontFamily: FontFamily.sans, color: Colors.textMuted, fontWeight: 'normal' },
  input: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radii.md,
    paddingHorizontal: Spacing.base, height: 48,
    fontFamily: FontFamily.sans, fontSize: FontSize.base, color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },
  textarea: { height: 100, paddingTop: Spacing.sm },
  assigneeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  assigneePill: {
    paddingHorizontal: Spacing.sm, paddingVertical: 6,
    borderRadius: Radii.pill,
  },
  assigneeText: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm },
  dateField: {
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radii.md,
    paddingHorizontal: Spacing.base, height: 48,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface,
  },
  dateValue: { fontFamily: FontFamily.sans, fontSize: FontSize.base, color: Colors.textPrimary },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xl },
});