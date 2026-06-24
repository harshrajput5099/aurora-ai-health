import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useHealth } from '../../context/HealthContext';
import { COLORS } from '../../constants/theme';

const HABIT_EMOJIS  = ['🧘','🚶','📖','🏋️','🌿','💊','🛏️','✍️','🎵','🍵'];
const DEFAULT_HABITS = ['Meditate','Walk 30 min','Read','Exercise','Journaling','Take vitamins','Sleep by 11pm','Stretch'];

export default function HabitsScreen({ navigation }) {
  const { habits, createHabit, completeHabit } = useHealth();
  const [creating,    setCreating]    = useState(false);
  const [newName,     setNewName]     = useState('');
  const [selectedIcon, setSelectedIcon] = useState('⭐');

  const done = habits.filter(h => h.completedToday).length;

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await createHabit(newName.trim(), 'daily', selectedIcon);
    setNewName(''); setCreating(false);
    Alert.alert('Habit created!', `"${newName}" added to your habits.`);
  };

  const handleComplete = async (h) => {
    if (h.completedToday) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await completeHabit(h.id);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F','#0A0A0F']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerRow}>
            <Text style={styles.title}>🔥 Habits</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => setCreating(true)}>
              <Text style={styles.addBtnText}>+ New</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress */}
        {habits.length > 0 && (
          <LinearGradient colors={['#4C1D10','#78350F']} style={styles.progressCard}>
            <Text style={styles.progressLabel}>Today's progress</Text>
            <Text style={styles.progressVal}>{done}/{habits.length} habits</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${habits.length ? (done / habits.length) * 100 : 0}%` }]}>
                <LinearGradient colors={['#D97706','#F59E0B']} style={StyleSheet.absoluteFill} />
              </View>
            </View>
            {done === habits.length && done > 0 &&
              <Text style={styles.perfectDay}>🔥 Perfect day!</Text>}
          </LinearGradient>
        )}

        {/* Create habit */}
        {creating && (
          <View style={styles.createCard}>
            <Text style={styles.createTitle}>Create New Habit</Text>
            <TextInput style={styles.input} value={newName} onChangeText={setNewName}
              placeholder="Habit name…" placeholderTextColor="#6B7280" />
            <Text style={styles.emojiLabel}>Choose icon:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.emojiRow}>
              {HABIT_EMOJIS.map(e => (
                <TouchableOpacity key={e} onPress={() => setSelectedIcon(e)}
                  style={[styles.emojiBtn, selectedIcon === e && styles.emojiBtnActive]}>
                  <Text style={styles.emojiText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.createActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setCreating(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleCreate}>
                <LinearGradient colors={['#D97706','#F59E0B']} style={styles.confirmGrad}>
                  <Text style={styles.confirmText}>Create</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Default habits suggestion (when 0 habits) */}
        {habits.length === 0 && !creating && (
          <View>
            <Text style={styles.sectionTitle}>Popular habits to start with:</Text>
            {DEFAULT_HABITS.map(name => (
              <TouchableOpacity key={name} style={styles.suggItem}
                onPress={() => createHabit(name, 'daily', HABIT_EMOJIS[DEFAULT_HABITS.indexOf(name) % HABIT_EMOJIS.length])}>
                <Text style={styles.suggText}>{name}</Text>
                <Text style={styles.suggAdd}>+ Add</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Habits list */}
        {habits.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Today's Habits</Text>
            {habits.map(h => (
              <TouchableOpacity key={h.id} style={[styles.habitCard, h.completedToday && styles.habitCardDone]}
                onPress={() => handleComplete(h)}>
                <View style={[styles.habitCheck, h.completedToday && styles.habitCheckDone]}>
                  {h.completedToday && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={styles.habitIcon}>{h.icon}</Text>
                <View style={styles.habitInfo}>
                  <Text style={[styles.habitName, h.completedToday && styles.habitNameDone]}>{h.name}</Text>
                  <Text style={styles.habitStreak}>🔥 {h.streak || 0} day streak</Text>
                </View>
                {h.completedToday && <Text style={styles.doneBadge}>Done!</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex:1, backgroundColor:COLORS.background },
  scroll:       { paddingHorizontal:20, paddingTop:60, paddingBottom:40 },
  header:       { marginBottom:24 },
  back:         { color:'#9CA3AF', fontSize:15, marginBottom:12 },
  headerRow:    { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  title:        { fontSize:26, fontWeight:'700', color:'#fff' },
  addBtn:       { backgroundColor:'rgba(245,158,11,0.15)', paddingHorizontal:16, paddingVertical:8,
                  borderRadius:20, borderWidth:1, borderColor:'rgba(245,158,11,0.3)' },
  addBtnText:   { color:'#F59E0B', fontWeight:'700', fontSize:14 },
  progressCard: { borderRadius:20, padding:20, marginBottom:24, borderWidth:1, borderColor:'rgba(245,158,11,0.3)' },
  progressLabel: { fontSize:13, color:'#FCD34D', marginBottom:4 },
  progressVal:  { fontSize:24, fontWeight:'800', color:'#fff', marginBottom:12 },
  progressBar:  { height:8, backgroundColor:'rgba(255,255,255,0.1)', borderRadius:4, overflow:'hidden' },
  progressFill: { height:'100%', borderRadius:4 },
  perfectDay:   { fontSize:15, fontWeight:'700', color:'#F59E0B', marginTop:10, textAlign:'center' },
  createCard:   { backgroundColor:'#12121A', borderRadius:20, padding:20, marginBottom:20,
                  borderWidth:1, borderColor:'#1F2937' },
  createTitle:  { fontSize:16, fontWeight:'700', color:'#fff', marginBottom:12 },
  input:        { backgroundColor:'#1A1A26', borderRadius:12, paddingHorizontal:16, paddingVertical:13,
                  fontSize:15, color:'#fff', borderWidth:1, borderColor:'#1F2937', marginBottom:12 },
  emojiLabel:   { fontSize:13, color:'#9CA3AF', marginBottom:8 },
  emojiRow:     { flexDirection:'row', gap:8, paddingRight:16, marginBottom:16 },
  emojiBtn:     { width:42, height:42, borderRadius:12, backgroundColor:'#1A1A26', justifyContent:'center', alignItems:'center',
                  borderWidth:1, borderColor:'#1F2937' },
  emojiBtnActive: { borderColor:'#F59E0B', backgroundColor:'rgba(245,158,11,0.15)' },
  emojiText:    { fontSize:20 },
  createActions: { flexDirection:'row', gap:10 },
  cancelBtn:    { flex:1, paddingVertical:12, borderRadius:12, backgroundColor:'#1A1A26',
                  alignItems:'center', borderWidth:1, borderColor:'#374151' },
  cancelText:   { color:'#9CA3AF', fontWeight:'600' },
  confirmBtn:   { flex:1, borderRadius:12, overflow:'hidden' },
  confirmGrad:  { paddingVertical:12, alignItems:'center' },
  confirmText:  { color:'#fff', fontWeight:'700' },
  sectionTitle: { fontSize:15, fontWeight:'700', color:'#fff', marginBottom:12 },
  suggItem:     { flexDirection:'row', justifyContent:'space-between', alignItems:'center',
                  backgroundColor:'#12121A', borderRadius:12, padding:16, marginBottom:8,
                  borderWidth:1, borderColor:'#1F2937' },
  suggText:     { fontSize:14, color:'#fff' },
  suggAdd:      { fontSize:13, color:'#F59E0B', fontWeight:'600' },
  habitCard:    { flexDirection:'row', alignItems:'center', gap:12,
                  backgroundColor:'#12121A', borderRadius:16, padding:16, marginBottom:10,
                  borderWidth:1, borderColor:'#1F2937' },
  habitCardDone: { backgroundColor:'rgba(245,158,11,0.08)', borderColor:'rgba(245,158,11,0.25)' },
  habitCheck:   { width:26, height:26, borderRadius:13, borderWidth:2, borderColor:'#374151',
                  justifyContent:'center', alignItems:'center' },
  habitCheckDone: { backgroundColor:'#F59E0B', borderColor:'#F59E0B' },
  checkMark:    { color:'#fff', fontSize:14, fontWeight:'700' },
  habitIcon:    { fontSize:22 },
  habitInfo:    { flex:1 },
  habitName:    { fontSize:15, fontWeight:'600', color:'#fff' },
  habitNameDone: { color:'rgba(255,255,255,0.5)', textDecorationLine:'line-through' },
  habitStreak:  { fontSize:12, color:'#9CA3AF', marginTop:2 },
  doneBadge:    { backgroundColor:'rgba(245,158,11,0.2)', paddingHorizontal:10, paddingVertical:4,
                  borderRadius:10, borderWidth:1, borderColor:'rgba(245,158,11,0.4)' },
});