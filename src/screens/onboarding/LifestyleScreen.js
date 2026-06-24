import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/theme';

const WAKE_TIMES = ['5:00 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '9:00 AM'];
const BED_TIMES  = ['9:00 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '1:00 AM'];
const ACTIVITY   = [
  { label: '🪑 Sedentary', sub: 'Mostly sitting', value: 'sedentary' },
  { label: '🚶 Light',     sub: '1–2 days/week',  value: 'light' },
  { label: '🏃 Moderate',  sub: '3–4 days/week',  value: 'moderate' },
  { label: '💪 Active',    sub: '5+ days/week',   value: 'active' },
];

export default function LifestyleScreen({ navigation, route }) {
  const { personalInfo } = route.params;
  const [wakeTime,  setWakeTime]  = useState('7:00 AM');
  const [bedTime,   setBedTime]   = useState('11:00 PM');
  const [activity,  setActivity]  = useState('moderate');

  const next = () => {
    navigation.navigate('Goals', { personalInfo, lifestyle: { wakeTime, bedTime, activity } });
  };

  const Picker = ({ label, options, value, onSelect }) => (
    <View style={styles.pickerGroup}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
        {options.map(o => (
          <TouchableOpacity key={o} onPress={() => onSelect(o)}
            style={[styles.chip, value === o && styles.chipActive]}>
            <Text style={[styles.chipText, value === o && styles.chipTextActive]}>{o}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F', '#12091F']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.progress}>
          {[1,2,3].map(i => (
            <View key={i} style={[styles.progressDot, i <= 2 && styles.progressDotActive]} />
          ))}
        </View>

        <Text style={styles.step}>Step 2 of 3</Text>
        <Text style={styles.title}>Your lifestyle</Text>
        <Text style={styles.sub}>Helps Aurora personalize your reminders</Text>

        <Picker label="Wake-up Time" options={WAKE_TIMES} value={wakeTime} onSelect={setWakeTime} />
        <Picker label="Bedtime"      options={BED_TIMES}  value={bedTime}  onSelect={setBedTime} />

        <Text style={[styles.label, {marginTop: 20}]}>Activity Level</Text>
        <View style={styles.activityGrid}>
          {ACTIVITY.map(a => (
            <TouchableOpacity key={a.value} onPress={() => setActivity(a.value)}
              style={[styles.actCard, activity === a.value && styles.actCardActive]}>
              <Text style={styles.actLabel}>{a.label}</Text>
              <Text style={styles.actSub}>{a.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.btn} onPress={next}>
          <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.btnGrad}>
            <Text style={styles.btnText}>Continue →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1 },
  scroll:          { paddingHorizontal: 28, paddingTop: 60, paddingBottom: 40 },
  back:            { marginBottom: 20 },
  backText:        { color: '#9CA3AF', fontSize: 15 },
  progress:        { flexDirection: 'row', gap: 8, marginBottom: 20 },
  progressDot:     { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#1F2937' },
  progressDotActive: { backgroundColor: '#7C3AED' },
  step:            { fontSize: 13, color: '#7C3AED', fontWeight: '600', marginBottom: 8 },
  title:           { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8 },
  sub:             { fontSize: 14, color: '#9CA3AF', marginBottom: 24 },
  pickerGroup:     { marginBottom: 8 },
  label:           { fontSize: 13, color: '#9CA3AF', fontWeight: '500', marginBottom: 8, marginTop: 12 },
  scrollRow:       { flexDirection: 'row', gap: 8, paddingRight: 16 },
  chip:            { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
                     backgroundColor: '#12121A', borderWidth: 1, borderColor: '#1F2937' },
  chipActive:      { backgroundColor: '#4C1D95', borderColor: '#7C3AED' },
  chipText:        { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },
  chipTextActive:  { color: '#fff' },
  activityGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actCard:         { width: '47%', backgroundColor: '#12121A', borderRadius: 14, padding: 16,
                     borderWidth: 1, borderColor: '#1F2937' },
  actCardActive:   { backgroundColor: '#1E0A3C', borderColor: '#7C3AED' },
  actLabel:        { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 4 },
  actSub:          { fontSize: 12, color: '#9CA3AF' },
  btn:             { borderRadius: 14, overflow: 'hidden', marginTop: 32,
                     shadowColor: '#7C3AED', shadowOffset:{width:0,height:6}, shadowOpacity:0.5, shadowRadius:12, elevation:8 },
  btnGrad:         { paddingVertical: 17, alignItems: 'center' },
  btnText:         { fontSize: 16, fontWeight: '700', color: '#fff' },
});