import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SetupCompleteScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue:1, tension:50, friction:8, useNativeDriver:true }),
      Animated.timing(fadeAnim, { toValue:1, duration:800, delay:300, useNativeDriver:true }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#0A0A0F','#12091F','#0A0A0F']} style={styles.container}>
      <View style={styles.glow} />
      <Animated.View style={[styles.content, { transform:[{scale:scaleAnim}], opacity:fadeAnim }]}>
        <View style={styles.iconWrap}>
          <LinearGradient colors={['#7C3AED','#06B6D4']} style={styles.iconGrad}>
            <Text style={styles.icon}>✦</Text>
          </LinearGradient>
        </View>
        <Text style={styles.title}>Aurora is ready!</Text>
        <Text style={styles.sub}>Your health journey starts now. Aurora will learn and grow with you every day.</Text>
        <View style={styles.features}>
          {['💧 Hydration tracking','😴 Sleep analysis','🔥 Habit building','🥗 Nutrition logging','🌌 AI health coach'].map(f => (
            <Text key={f} style={styles.feature}>{f}</Text>
          ))}
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  glow:      { position:'absolute', width:400, height:400, borderRadius:200,
               backgroundColor:'#7C3AED', opacity:0.08, top:'-10%' },
  content:   { alignItems:'center', paddingHorizontal:32 },
  iconWrap:  { width:100, height:100, borderRadius:32, overflow:'hidden', marginBottom:24,
               shadowColor:'#7C3AED', shadowOffset:{width:0,height:16}, shadowOpacity:0.6, shadowRadius:24, elevation:16 },
  iconGrad:  { flex:1, justifyContent:'center', alignItems:'center' },
  icon:      { fontSize:48, color:'#fff' },
  title:     { fontSize:32, fontWeight:'800', color:'#fff', marginBottom:12, textAlign:'center' },
  sub:       { fontSize:15, color:'#9CA3AF', textAlign:'center', lineHeight:22, marginBottom:32 },
  features:  { gap:12 },
  feature:   { fontSize:16, color:'rgba(255,255,255,0.8)', fontWeight:'500' },
});