import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useHealth } from '../../context/HealthContext';
import { COLORS, SIZES, SPACING } from '../../constants/theme';
import { generateInsight } from '../../services/aiService';

/* ── Reusable card ────────────────────────────────────────── */
const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

/* ── Circular progress ring ───────────────────────────────── */
const Ring = ({ pct, color, size = 64 }) => {
  const r = 28, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const dash  = circ * Math.min(pct / 100, 1);
  return (
    <View style={{ width: size, height: size }}>
      {/* Background ring */}
      <View style={{ position:'absolute', width:size, height:size, borderRadius:size/2,
                     borderWidth:4, borderColor: 'rgba(255,255,255,0.08)' }} />
      {/* We fake a progress arc with a conic-gradient-like approach via rotation */}
      <View style={{ position:'absolute', width:size, height:size, borderRadius:size/2,
                     borderWidth:4, borderColor:color, opacity: pct > 0 ? 1 : 0,
                     borderLeftColor: pct < 25 ? 'transparent' : color,
                     borderBottomColor: pct < 50 ? 'transparent' : color,
                     borderRightColor: pct < 75 ? 'transparent' : color,
                     transform:[{ rotate: `${(pct/100)*360}deg` }] }} />
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <Text style={{ fontSize:13, fontWeight:'700', color:'#fff' }}>{Math.round(pct)}%</Text>
      </View>
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const { userProfile } = useAuth();
  const { hydration, sleep, habits, nutrition, loadAll, getDailyInsight } = useHealth();
  const [aiInsight,   setAiInsight]  = useState('');
  const [refreshing,  setRefreshing] = useState(false);
  const name = userProfile?.name || 'there';

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return `Good morning, ${name} 🌤`;
    if (h < 17) return `Good afternoon, ${name} ☀️`;
    return `Good evening, ${name} 🌙`;
  };

  useEffect(() => {
    fetchInsight();
  }, []);

  const fetchInsight = async () => {
    const ctx = {
      hydration: { today: hydration.today, goal: hydration.goal, percentage: Math.round((hydration.today / hydration.goal) * 100) },
      sleep:     { lastNight: sleep.lastNight, weeklyAvg: sleep.weeklyAvg },
      habits:    { completed: habits.filter(h => h.completedToday).length, total: habits.length },
      nutrition: { calories: nutrition.calories },
    };
    const msg = await generateInsight(ctx);
    setAiInsight(msg);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    await fetchInsight();
    setRefreshing(false);
  };

  const hydPct = Math.round((hydration.today / hydration.goal) * 100);
  const habPct = habits.length ? Math.round((habits.filter(h => h.completedToday).length / habits.length) * 100) : 0;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F', '#0A0A0F']} style={StyleSheet.absoluteFill} />

      <ScrollView contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greet}>{greet()}</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}
            style={styles.avatar}>
            <LinearGradient colors={['#7C3AED','#5B21B6']} style={styles.avatarGrad}>
              <Text style={styles.avatarText}>{name[0]?.toUpperCase()}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* AI Insight Card */}
        <LinearGradient colors={['#1E0A3C','#12091F']} style={styles.insightCard} start={{x:0,y:0}} end={{x:1,y:1}}>
          <View style={styles.insightRow}>
            <View style={styles.auraIcon}><Text style={styles.auraEmoji}>✦</Text></View>
            <View style={styles.insightContent}>
              <Text style={styles.insightLabel}>Daily Insight from Aurora</Text>
              <Text style={styles.insightText}>{aiInsight || getDailyInsight()}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Today's overview row */}
        <Text style={styles.sectionTitle}>Today's Overview</Text>
        <View style={styles.overviewRow}>
          {[
            { label:'Hydration', pct:hydPct,  color:COLORS.hydration, emoji:'💧', val:`${hydration.today}ml` },
            { label:'Sleep',     pct:sleep.lastNight ? (sleep.lastNight/8)*100 : 0,
                                               color:COLORS.sleep,     emoji:'😴', val:`${sleep.lastNight}h` },
            { label:'Habits',    pct:habPct,   color:COLORS.habits,    emoji:'🔥', val:`${habits.filter(h=>h.completedToday).length}/${habits.length}` },
          ].map(item => (
            <Card key={item.label} style={styles.overviewCard}>
              <Ring pct={Math.min(item.pct, 100)} color={item.color} />
              <Text style={styles.overviewLabel}>{item.emoji} {item.label}</Text>
              <Text style={styles.overviewVal}>{item.val}</Text>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Track</Text>
        <View style={styles.quickGrid}>
          {[
            { label:'💧 Water',   color:['#1D4ED8','#06B6D4'], route:'Track',   screen:'Hydration' },
            { label:'😴 Sleep',   color:['#4C1D95','#7C3AED'], route:'Track',   screen:'Sleep'     },
            { label:'🔥 Habits',  color:['#D97706','#F59E0B'], route:'Track',   screen:'Habits'    },
            { label:'🥗 Meals',   color:['#047857','#10B981'], route:'Track',   screen:'Nutrition' },
          ].map(item => (
            <TouchableOpacity key={item.label} style={styles.quickCard}
              onPress={() => navigation.navigate(item.route, { screen: item.screen })}>
              <LinearGradient colors={item.color} style={styles.quickGrad}>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nutrition Summary */}
        <Text style={styles.sectionTitle}>Nutrition Today</Text>
        <Card style={styles.nutritionCard}>
          {[
            { label:'Calories', val:nutrition.calories || 0, unit:'kcal', color:'#F59E0B' },
            { label:'Protein',  val:nutrition.protein  || 0, unit:'g',    color:'#10B981' },
            { label:'Carbs',    val:nutrition.carbs    || 0, unit:'g',    color:'#3B82F6' },
            { label:'Fat',      val:nutrition.fat      || 0, unit:'g',    color:'#EF4444' },
          ].map(n => (
            <View key={n.label} style={styles.macroRow}>
              <View style={[styles.macroDot, { backgroundColor: n.color }]} />
              <Text style={styles.macroLabel}>{n.label}</Text>
              <Text style={styles.macroVal}>{n.val} {n.unit}</Text>
            </View>
          ))}
          {(nutrition.meals || []).length === 0 && (
            <Text style={styles.empty}>No meals logged yet today</Text>
          )}
        </Card>

        {/* Ask Aurora CTA */}
        <TouchableOpacity style={styles.auroraBtn}
          onPress={() => navigation.navigate('Aurora')}>
          <LinearGradient colors={['#7C3AED','#06B6D4']} style={styles.auroraBtnGrad} start={{x:0,y:0}} end={{x:1,y:0}}>
            <Text style={styles.auroraEmoji}>🌌</Text>
            <View>
              <Text style={styles.auroraBtnTitle}>Ask Aurora</Text>
              <Text style={styles.auroraBtnSub}>Your AI health companion</Text>
            </View>
            <Text style={styles.auroraBtnArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.background },
  scroll:       { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greet:        { fontSize: 22, fontWeight: '700', color: '#fff' },
  date:         { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  avatar:       { width: 42, height: 42, borderRadius: 21, overflow: 'hidden' },
  avatarGrad:   { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarText:   { fontSize: 18, fontWeight: '700', color: '#fff' },
  insightCard:  { borderRadius: 20, padding: 18, marginBottom: 28, borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)' },
  insightRow:   { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  auraIcon:     { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(124,58,237,0.3)', justifyContent:'center', alignItems:'center' },
  auraEmoji:    { fontSize: 16, color: '#A78BFA' },
  insightContent: { flex: 1 },
  insightLabel: { fontSize: 11, color: '#A78BFA', fontWeight: '600', marginBottom: 4, textTransform:'uppercase', letterSpacing:0.8 },
  insightText:  { fontSize: 14, color: '#fff', lineHeight: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 12 },
  overviewRow:  { flexDirection: 'row', gap: 10, marginBottom: 28 },
  overviewCard: { flex: 1, alignItems: 'center', gap: 8, padding: 14 },
  overviewLabel: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center' },
  overviewVal:  { fontSize: 13, fontWeight: '700', color: '#fff' },
  quickGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  quickCard:    { width: '47%', borderRadius: 14, overflow: 'hidden' },
  quickGrad:    { paddingVertical: 18, paddingHorizontal: 16 },
  quickLabel:   { fontSize: 14, fontWeight: '700', color: '#fff' },
  nutritionCard: { marginBottom: 24, gap: 10 },
  macroRow:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  macroDot:     { width: 8, height: 8, borderRadius: 4 },
  macroLabel:   { flex: 1, fontSize: 14, color: COLORS.textSecondary },
  macroVal:     { fontSize: 14, fontWeight: '600', color: '#fff' },
  empty:        { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', paddingVertical: 8 },
  card:         { backgroundColor: COLORS.surface, borderRadius: 18, padding: 16, borderWidth:1, borderColor:COLORS.border },
  auroraBtn:    { borderRadius: 18, overflow: 'hidden',
                  shadowColor:'#7C3AED', shadowOffset:{width:0,height:8}, shadowOpacity:0.5, shadowRadius:16, elevation:12 },
  auroraBtnGrad: { flexDirection:'row', alignItems:'center', gap:14, padding:18 },
  auroraEmoji:  { fontSize:28 },
  auroraBtnTitle: { fontSize:16, fontWeight:'700', color:'#fff' },
  auroraBtnSub: { fontSize:12, color:'rgba(255,255,255,0.7)' },
  auroraBtnArrow: { marginLeft:'auto', fontSize:20, color:'#fff' },
});