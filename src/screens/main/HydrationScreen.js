import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useHealth } from '../../context/HealthContext';
import { COLORS } from '../../constants/theme';

const QUICK_AMOUNTS = [150, 250, 350, 500];

export default function HydrationScreen({ navigation }) {
  const { hydration, addWater } = useHealth();
  const [custom, setCustom] = useState('');
  const pct = Math.min((hydration.today / hydration.goal) * 100, 100);

  const handleAdd = async (amount) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await addWater(amount);
  };

  const handleCustom = async () => {
    const n = parseInt(custom);
    if (!n || n < 1 || n > 5000) return Alert.alert('Invalid amount', 'Enter between 1 and 5000 ml');
    await handleAdd(n);
    setCustom('');
  };

  const remaining = Math.max(hydration.goal - hydration.today, 0);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F','#0A0A0F']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>💧 Hydration</Text>
        </View>

        {/* Virtual water bottle */}
        <View style={styles.bottleContainer}>
          <View style={styles.bottleWrap}>
            <View style={styles.bottleOuter}>
              <View style={[styles.bottleFill, { height: `${pct}%` }]}>
                <LinearGradient colors={['#06B6D4','#1D4ED8']} style={StyleSheet.absoluteFill} />
              </View>
              {/* Ripple lines */}
              {pct > 10 && [0,1,2].map(i => (
                <View key={i} style={[styles.ripple, { bottom: `${pct - 4 + i * 3}%` }]} />
              ))}
            </View>
          </View>

          <View style={styles.bottleStats}>
            <Text style={styles.bottleVal}>{hydration.today}<Text style={styles.bottleUnit}>ml</Text></Text>
            <Text style={styles.bottleGoal}>Goal: {hydration.goal}ml</Text>
            <Text style={styles.bottlePct}>{Math.round(pct)}% complete</Text>
            {remaining > 0
              ? <Text style={styles.bottleRemain}>🎯 {remaining}ml remaining</Text>
              : <Text style={styles.bottleDone}>🎉 Goal reached!</Text>}
          </View>
        </View>

        {/* Quick add buttons */}
        <Text style={styles.sectionTitle}>Quick Add</Text>
        <View style={styles.quickRow}>
          {QUICK_AMOUNTS.map(a => (
            <TouchableOpacity key={a} style={styles.quickBtn} onPress={() => handleAdd(a)}>
              <LinearGradient colors={['#1D4ED8','#06B6D4']} style={styles.quickGrad}>
                <Text style={styles.quickBtnText}>+{a}</Text>
                <Text style={styles.quickBtnUnit}>ml</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom entry */}
        <Text style={styles.sectionTitle}>Custom Amount</Text>
        <View style={styles.customRow}>
          <TextInput style={styles.customInput} value={custom} onChangeText={setCustom}
            placeholder="Enter ml" placeholderTextColor="#6B7280"
            keyboardType="numeric" />
          <TouchableOpacity onPress={handleCustom} style={styles.customBtn}>
            <LinearGradient colors={['#1D4ED8','#06B6D4']} style={styles.customBtnGrad}>
              <Text style={styles.customBtnText}>Add</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Insight */}
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>
            {pct >= 100 ? '🎉 Amazing! You hit your hydration goal today.'
              : pct >= 75 ? '👍 You\'re close! Just a bit more to go.'
              : pct >= 50 ? '💧 Halfway there! Keep sipping.'
              : '💡 Tip: Drink a glass every hour to stay on track.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex:1, backgroundColor:COLORS.background },
  scroll:       { paddingHorizontal:20, paddingTop:60, paddingBottom:40 },
  header:       { marginBottom:28 },
  back:         { color:'#9CA3AF', fontSize:15, marginBottom:12 },
  title:        { fontSize:26, fontWeight:'700', color:'#fff' },
  bottleContainer: { flexDirection:'row', alignItems:'center', gap:20, marginBottom:32 },
  bottleWrap:   { alignItems:'center' },
  bottleOuter:  { width:80, height:160, borderRadius:20, borderWidth:2, borderColor:'rgba(6,182,212,0.4)',
                  overflow:'hidden', backgroundColor:'rgba(6,182,212,0.08)', justifyContent:'flex-end' },
  bottleFill:   { width:'100%', overflow:'hidden' },
  ripple:       { position:'absolute', left:8, right:8, height:1.5, backgroundColor:'rgba(255,255,255,0.2)', borderRadius:1 },
  bottleStats:  { flex:1 },
  bottleVal:    { fontSize:42, fontWeight:'800', color:'#fff' },
  bottleUnit:   { fontSize:18, fontWeight:'400', color:'#9CA3AF' },
  bottleGoal:   { fontSize:13, color:'#9CA3AF', marginBottom:4 },
  bottlePct:    { fontSize:15, fontWeight:'700', color:'#06B6D4', marginBottom:4 },
  bottleRemain: { fontSize:13, color:'#9CA3AF' },
  bottleDone:   { fontSize:13, color:'#10B981', fontWeight:'600' },
  sectionTitle: { fontSize:15, fontWeight:'700', color:'#fff', marginBottom:12 },
  quickRow:     { flexDirection:'row', gap:10, marginBottom:24 },
  quickBtn:     { flex:1, borderRadius:14, overflow:'hidden' },
  quickGrad:    { paddingVertical:16, alignItems:'center' },
  quickBtnText: { fontSize:16, fontWeight:'700', color:'#fff' },
  quickBtnUnit: { fontSize:11, color:'rgba(255,255,255,0.7)' },
  customRow:    { flexDirection:'row', gap:10, marginBottom:24 },
  customInput:  { flex:1, backgroundColor:'#12121A', borderRadius:12, paddingHorizontal:16,
                  paddingVertical:14, fontSize:15, color:'#fff', borderWidth:1, borderColor:'#1F2937' },
  customBtn:    { borderRadius:12, overflow:'hidden' },
  customBtnGrad: { paddingVertical:14, paddingHorizontal:24, justifyContent:'center' },
  customBtnText: { fontSize:15, fontWeight:'700', color:'#fff' },
  insightBox:   { backgroundColor:'rgba(6,182,212,0.1)', borderRadius:16, padding:16,
                  borderWidth:1, borderColor:'rgba(6,182,212,0.25)' },
  insightText:  { fontSize:14, color:'#e0f2fe', lineHeight:20 },
});