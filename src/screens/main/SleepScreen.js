import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHealth } from '../../context/HealthContext';
import { COLORS } from '../../constants/theme';

const HOURS_OPTIONS = [4,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10];
const QUALITY = [
  { label:'😴 Poor', value:'poor', color:'#EF4444' },
  { label:'😐 Fair', value:'fair', color:'#F59E0B' },
  { label:'😊 Good', value:'good', color:'#10B981' },
  { label:'🌟 Great', value:'great', color:'#3B82F6' },
];

export default function SleepScreen({ navigation }) {
  const { sleep, logSleep } = useHealth();
  const [hours,   setHours]   = useState(7);
  const [quality, setQuality] = useState('good');
  const [saving,  setSaving]  = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await logSleep(hours);
      Alert.alert('Logged!', `${hours}h sleep recorded.`);
    } finally { setSaving(false); }
  };

  const getBand = (h) =>
    h >= 8 ? { label:'Great', color:'#10B981' }
    : h >= 7 ? { label:'Good',  color:'#3B82F6' }
    : h >= 6 ? { label:'Fair',  color:'#F59E0B' }
    :          { label:'Poor',  color:'#EF4444' };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F','#0A0A0F']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>😴 Sleep</Text>
        </View>

        {/* Last night summary */}
        <LinearGradient colors={['#1E0A3C','#12091F']} style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryVal}>{sleep.lastNight || '—'}h</Text>
              <Text style={styles.summaryLabel}>Last night</Text>
            </View>
            <View style={styles.summaryDivider}/>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryVal}>{sleep.weeklyAvg || '—'}h</Text>
              <Text style={styles.summaryLabel}>Weekly avg</Text>
            </View>
            <View style={styles.summaryDivider}/>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryVal, { color: getBand(sleep.lastNight).color }]}>
                {getBand(sleep.lastNight).label}
              </Text>
              <Text style={styles.summaryLabel}>Quality</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Log sleep */}
        <Text style={styles.sectionTitle}>Log Last Night's Sleep</Text>
        <Text style={styles.sectionSub}>Select hours slept:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hoursRow}>
          {HOURS_OPTIONS.map(h => (
            <TouchableOpacity key={h} onPress={() => setHours(h)}
              style={[styles.hourBtn, hours === h && styles.hourBtnActive]}>
              <Text style={[styles.hourText, hours === h && styles.hourTextActive]}>{h}h</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Big hours display */}
        <View style={styles.bigDisplay}>
          <Text style={styles.bigHours}>{hours}</Text>
          <Text style={styles.bigUnit}>hours</Text>
          <View style={[styles.qualityBadge, { backgroundColor: `${getBand(hours).color}25` }]}>
            <Text style={[styles.qualityText, { color: getBand(hours).color }]}>
              {getBand(hours).label} sleep duration
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
          <LinearGradient colors={['#4C1D95','#7C3AED']} style={styles.saveBtnGrad}>
            <Text style={styles.saveBtnText}>{saving ? 'Saving…' : '💾 Save Sleep Log'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Insight */}
        <View style={styles.insightBox}>
          <Text style={styles.insightTitle}>💡 Sleep Insight</Text>
          <Text style={styles.insightText}>
            {sleep.weeklyAvg >= 7.5
              ? 'Excellent! Your weekly average is above the recommended 7.5h.'
              : sleep.weeklyAvg >= 6
              ? 'You\'re getting decent sleep, but aiming for 7–9h would boost your energy.'
              : 'Your weekly average is below 6h. Prioritize sleep — it affects everything!'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex:1, backgroundColor:COLORS.background },
  scroll:         { paddingHorizontal:20, paddingTop:60, paddingBottom:40 },
  header:         { marginBottom:28 },
  back:           { color:'#9CA3AF', fontSize:15, marginBottom:12 },
  title:          { fontSize:26, fontWeight:'700', color:'#fff' },
  summaryCard:    { borderRadius:20, padding:20, marginBottom:28, borderWidth:1, borderColor:'rgba(124,58,237,0.3)' },
  summaryRow:     { flexDirection:'row', justifyContent:'space-around' },
  summaryItem:    { alignItems:'center' },
  summaryVal:     { fontSize:24, fontWeight:'700', color:'#fff' },
  summaryLabel:   { fontSize:12, color:'#9CA3AF', marginTop:4 },
  summaryDivider: { width:1, backgroundColor:'rgba(255,255,255,0.1)' },
  sectionTitle:   { fontSize:15, fontWeight:'700', color:'#fff', marginBottom:4 },
  sectionSub:     { fontSize:13, color:'#9CA3AF', marginBottom:12 },
  hoursRow:       { flexDirection:'row', gap:8, paddingRight:16, marginBottom:24 },
  hourBtn:        { paddingHorizontal:16, paddingVertical:10, borderRadius:20,
                    backgroundColor:'#12121A', borderWidth:1, borderColor:'#1F2937' },
  hourBtnActive:  { backgroundColor:'#4C1D95', borderColor:'#7C3AED' },
  hourText:       { fontSize:14, fontWeight:'600', color:'#9CA3AF' },
  hourTextActive: { color:'#fff' },
  bigDisplay:     { alignItems:'center', paddingVertical:24, marginBottom:20 },
  bigHours:       { fontSize:72, fontWeight:'800', color:'#fff' },
  bigUnit:        { fontSize:18, color:'#9CA3AF', marginTop:-8, marginBottom:12 },
  qualityBadge:   { paddingHorizontal:16, paddingVertical:6, borderRadius:20 },
  qualityText:    { fontSize:14, fontWeight:'600' },
  saveBtn:        { borderRadius:14, overflow:'hidden', marginBottom:24,
                    shadowColor:'#7C3AED', shadowOffset:{width:0,height:6}, shadowOpacity:0.5, shadowRadius:12, elevation:8 },
  saveBtnGrad:    { paddingVertical:17, alignItems:'center' },
  saveBtnText:    { fontSize:16, fontWeight:'700', color:'#fff' },
  insightBox:     { backgroundColor:'rgba(139,92,246,0.1)', borderRadius:16, padding:16, borderWidth:1, borderColor:'rgba(139,92,246,0.25)' },
  insightTitle:   { fontSize:14, fontWeight:'700', color:'#A78BFA', marginBottom:6 },
  insightText:    { fontSize:13, color:'#e9d5ff', lineHeight:19 },
});