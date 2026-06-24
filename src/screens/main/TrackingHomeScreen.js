import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/theme';

const MODULES = [
  { label:'💧 Hydration', sub:'Track daily water intake', colors:['#1D4ED8','#06B6D4'], screen:'Hydration' },
  { label:'😴 Sleep',     sub:'Log & analyze sleep',      colors:['#4C1D95','#7C3AED'], screen:'Sleep'     },
  { label:'🔥 Habits',    sub:'Build daily habits',       colors:['#D97706','#F59E0B'], screen:'Habits'    },
  { label:'🥗 Nutrition', sub:'Log meals & macros',       colors:['#047857','#10B981'], screen:'Nutrition'  },
];

export default function TrackingHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F','#0A0A0F']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Track Health</Text>
        <Text style={styles.sub}>Log your daily health data</Text>
        {MODULES.map(m => (
          <TouchableOpacity key={m.screen} style={styles.card}
            onPress={() => navigation.navigate(m.screen)}>
            <LinearGradient colors={m.colors} style={styles.cardGrad} start={{x:0,y:0}} end={{x:1,y:1}}>
              <View>
                <Text style={styles.cardLabel}>{m.label}</Text>
                <Text style={styles.cardSub}>{m.sub}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:COLORS.background },
  scroll:    { paddingHorizontal:20, paddingTop:70, paddingBottom:40, gap:14 },
  title:     { fontSize:28, fontWeight:'700', color:'#fff', marginBottom:4 },
  sub:       { fontSize:14, color:'#9CA3AF', marginBottom:20 },
  card:      { borderRadius:18, overflow:'hidden',
               shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.3, shadowRadius:8, elevation:6 },
  cardGrad:  { padding:24, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
  cardLabel: { fontSize:20, fontWeight:'700', color:'#fff', marginBottom:4 },
  cardSub:   { fontSize:13, color:'rgba(255,255,255,0.7)' },
  arrow:     { fontSize:22, color:'#fff' },
});