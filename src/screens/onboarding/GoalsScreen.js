import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';

const GOALS = [
  { id: 'hydration',    emoji: '💧', label: 'Improve Hydration',      sub: 'Drink more water daily' },
  { id: 'sleep',        emoji: '😴', label: 'Sleep Better',           sub: 'Improve quality & duration' },
  { id: 'habits',       emoji: '🔥', label: 'Build Better Habits',    sub: 'Create lasting routines' },
  { id: 'nutrition',    emoji: '🥗', label: 'Eat Healthier',          sub: 'Improve your diet' },
  { id: 'energy',       emoji: '⚡', label: 'Improve Energy',         sub: 'Feel more energized' },
  { id: 'consistency',  emoji: '🎯', label: 'Stay Consistent',        sub: 'Build daily discipline' },
];

export default function GoalsScreen({ navigation, route }) {
  const { completeOnboarding } = useAuth();
  const { personalInfo, lifestyle } = route.params;
  const [selected, setSelected] = useState([]);
  const [loading,  setLoading]  = useState(false);

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const finish = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      await completeOnboarding({
        ...personalInfo, ...lifestyle,
        goals: selected,
        hydrationGoal: 2500,
      });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F', '#12091F']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.progress}>
          {[1,2,3].map(i => (
            <View key={i} style={[styles.progressDot, styles.progressDotActive]} />
          ))}
        </View>

        <Text style={styles.step}>Step 3 of 3</Text>
        <Text style={styles.title}>Your health goals</Text>
        <Text style={styles.sub}>Choose what you want to improve (pick all that apply)</Text>

        <View style={styles.grid}>
          {GOALS.map(g => {
            const active = selected.includes(g.id);
            return (
              <TouchableOpacity key={g.id} onPress={() => toggle(g.id)}
                style={[styles.card, active && styles.cardActive]}>
                {active && <View style={styles.checkBadge}><Text>✓</Text></View>}
                <Text style={styles.cardEmoji}>{g.emoji}</Text>
                <Text style={[styles.cardLabel, active && styles.cardLabelActive]}>{g.label}</Text>
                <Text style={styles.cardSub}>{g.sub}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={[styles.btn, selected.length === 0 && styles.btnDisabled]}
          onPress={finish} disabled={loading || selected.length === 0}>
          <LinearGradient colors={selected.length > 0 ? ['#7C3AED','#5B21B6'] : ['#374151','#374151']} style={styles.btnGrad}>
            <Text style={styles.btnText}>
              {loading ? 'Setting up Aurora…' : `Let's Go! (${selected.length} selected)`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1 },
  scroll:        { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  back:          { marginBottom: 20 },
  backText:      { color: '#9CA3AF', fontSize: 15 },
  progress:      { flexDirection: 'row', gap: 8, marginBottom: 20 },
  progressDot:   { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#1F2937' },
  progressDotActive: { backgroundColor: '#7C3AED' },
  step:          { fontSize: 13, color: '#7C3AED', fontWeight: '600', marginBottom: 8 },
  title:         { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8 },
  sub:           { fontSize: 14, color: '#9CA3AF', marginBottom: 24 },
  grid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card:          { width: '47%', backgroundColor: '#12121A', borderRadius: 16, padding: 16,
                   borderWidth: 1, borderColor: '#1F2937', position: 'relative' },
  cardActive:    { backgroundColor: '#1E0A3C', borderColor: '#7C3AED' },
  checkBadge:    { position: 'absolute', top: 10, right: 10, width: 22, height: 22,
                   borderRadius: 11, backgroundColor: '#7C3AED', justifyContent: 'center', alignItems: 'center' },
  cardEmoji:     { fontSize: 28, marginBottom: 10 },
  cardLabel:     { fontSize: 13, fontWeight: '600', color: '#9CA3AF', marginBottom: 4 },
  cardLabelActive: { color: '#fff' },
  cardSub:       { fontSize: 11, color: '#6B7280' },
  btn:           { borderRadius: 14, overflow: 'hidden', marginTop: 28,
                   shadowColor: '#7C3AED', shadowOffset:{width:0,height:6}, shadowOpacity:0.5, shadowRadius:12, elevation:8 },
  btnDisabled:   { shadowOpacity: 0 },
  btnGrad:       { paddingVertical: 17, alignItems: 'center' },
  btnText:       { fontSize: 16, fontWeight: '700', color: '#fff' },
});