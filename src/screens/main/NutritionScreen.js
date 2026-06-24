import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHealth } from '../../context/HealthContext';
import { COLORS } from '../../constants/theme';

const MEAL_TYPES = [
  { type:'breakfast', emoji:'🍳', label:'Breakfast' },
  { type:'lunch',     emoji:'🥗', label:'Lunch'     },
  { type:'dinner',    emoji:'🍽️', label:'Dinner'    },
  { type:'snack',     emoji:'🍎', label:'Snack'     },
];

export default function NutritionScreen({ navigation }) {
  const { nutrition, logMeal } = useHealth();
  const [mealType, setMealType] = useState('breakfast');
  const [desc,     setDesc]     = useState('');
  const [cals,     setCals]     = useState('');
  const [protein,  setProtein]  = useState('');
  const [carbs,    setCarbs]    = useState('');
  const [fat,      setFat]      = useState('');
  const [saving,   setSaving]   = useState(false);

  const save = async () => {
    if (!desc.trim()) return Alert.alert('Error', 'Please describe your meal.');
    setSaving(true);
    try {
      await logMeal(mealType, desc.trim(), parseInt(cals)||0, parseInt(protein)||0, parseInt(carbs)||0, parseInt(fat)||0);
      setDesc(''); setCals(''); setProtein(''); setCarbs(''); setFat('');
      Alert.alert('Logged!', 'Meal saved successfully.');
    } finally { setSaving(false); }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F','#0A0A0F']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🥗 Nutrition</Text>
        </View>

        {/* Daily summary */}
        <LinearGradient colors={['#052E16','#14532D']} style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Nutrition</Text>
          <View style={styles.macrosRow}>
            {[
              { label:'Calories', val:nutrition.calories||0, unit:'kcal', color:'#F59E0B' },
              { label:'Protein',  val:nutrition.protein||0,  unit:'g',    color:'#10B981' },
              { label:'Carbs',    val:nutrition.carbs||0,    unit:'g',    color:'#3B82F6' },
              { label:'Fat',      val:nutrition.fat||0,      unit:'g',    color:'#EF4444' },
            ].map(m => (
              <View key={m.label} style={styles.macroItem}>
                <Text style={[styles.macroVal, { color:m.color }]}>{m.val}</Text>
                <Text style={styles.macroUnit}>{m.unit}</Text>
                <Text style={styles.macroLabel}>{m.label}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.mealCount}>{(nutrition.meals||[]).length} meals logged today</Text>
        </LinearGradient>

        {/* Meal type selector */}
        <Text style={styles.sectionTitle}>Log a Meal</Text>
        <View style={styles.mealTypeRow}>
          {MEAL_TYPES.map(m => (
            <TouchableOpacity key={m.type} onPress={() => setMealType(m.type)}
              style={[styles.mealTypeBtn, mealType === m.type && styles.mealTypeBtnActive]}>
              <Text style={styles.mealTypeEmoji}>{m.emoji}</Text>
              <Text style={[styles.mealTypeLabel, mealType === m.type && styles.mealTypeLabelActive]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meal description */}
        <TextInput style={styles.descInput} value={desc} onChangeText={setDesc}
          placeholder="What did you eat? (e.g. Oatmeal with banana and honey)"
          placeholderTextColor="#6B7280" multiline numberOfLines={3} />

        <Text style={styles.macroHint}>Optional: Add nutrition info</Text>
        <View style={styles.macroInputRow}>
          {[
            { label:'Calories', value:cals,    set:setCals,    placeholder:'kcal' },
            { label:'Protein',  value:protein,  set:setProtein, placeholder:'g'    },
            { label:'Carbs',    value:carbs,    set:setCarbs,   placeholder:'g'    },
            { label:'Fat',      value:fat,      set:setFat,     placeholder:'g'    },
          ].map(f => (
            <View key={f.label} style={styles.macroField}>
              <Text style={styles.macroFieldLabel}>{f.label}</Text>
              <TextInput style={styles.macroInput} value={f.value} onChangeText={f.set}
                placeholder={f.placeholder} placeholderTextColor="#6B7280" keyboardType="numeric" />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
          <LinearGradient colors={['#047857','#10B981']} style={styles.saveBtnGrad}>
            <Text style={styles.saveBtnText}>{saving ? 'Saving…' : '💾 Log Meal'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Meals log */}
        {(nutrition.meals||[]).length > 0 && (
          <View style={{marginTop:24}}>
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            {[...(nutrition.meals||[])].reverse().map((m, i) => (
              <View key={i} style={styles.mealItem}>
                <Text style={styles.mealEmoji}>{MEAL_TYPES.find(t=>t.type===m.type)?.emoji || '🍽️'}</Text>
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>{m.description}</Text>
                  {m.calories > 0 && <Text style={styles.mealCals}>{m.calories} kcal</Text>}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex:1, backgroundColor:COLORS.background },
  scroll:         { paddingHorizontal:20, paddingTop:60, paddingBottom:40 },
  header:         { marginBottom:24 },
  back:           { color:'#9CA3AF', fontSize:15, marginBottom:12 },
  title:          { fontSize:26, fontWeight:'700', color:'#fff' },
  summaryCard:    { borderRadius:20, padding:20, marginBottom:28, borderWidth:1, borderColor:'rgba(16,185,129,0.3)' },
  summaryTitle:   { fontSize:14, color:'#6EE7B7', fontWeight:'600', marginBottom:16 },
  macrosRow:      { flexDirection:'row', justifyContent:'space-around', marginBottom:12 },
  macroItem:      { alignItems:'center' },
  macroVal:       { fontSize:24, fontWeight:'800' },
  macroUnit:      { fontSize:11, color:'#9CA3AF' },
  macroLabel:     { fontSize:12, color:'#9CA3AF', marginTop:4 },
  mealCount:      { fontSize:12, color:'rgba(255,255,255,0.5)', textAlign:'center' },
  sectionTitle:   { fontSize:15, fontWeight:'700', color:'#fff', marginBottom:12 },
  mealTypeRow:    { flexDirection:'row', gap:8, marginBottom:16 },
  mealTypeBtn:    { flex:1, backgroundColor:'#12121A', borderRadius:12, padding:12,
                    alignItems:'center', borderWidth:1, borderColor:'#1F2937' },
  mealTypeBtnActive: { backgroundColor:'rgba(16,185,129,0.1)', borderColor:'#10B981' },
  mealTypeEmoji:  { fontSize:20, marginBottom:4 },
  mealTypeLabel:  { fontSize:11, color:'#9CA3AF', fontWeight:'500' },
  mealTypeLabelActive: { color:'#10B981' },
  descInput:      { backgroundColor:'#12121A', borderRadius:12, paddingHorizontal:16, paddingVertical:14,
                    fontSize:14, color:'#fff', borderWidth:1, borderColor:'#1F2937',
                    textAlignVertical:'top', marginBottom:16 },
  macroHint:      { fontSize:13, color:'#9CA3AF', marginBottom:10 },
  macroInputRow:  { flexDirection:'row', gap:8, marginBottom:20 },
  macroField:     { flex:1 },
  macroFieldLabel: { fontSize:11, color:'#9CA3AF', marginBottom:6, fontWeight:'500' },
  macroInput:     { backgroundColor:'#12121A', borderRadius:10, paddingHorizontal:10, paddingVertical:12,
                    fontSize:14, color:'#fff', textAlign:'center', borderWidth:1, borderColor:'#1F2937' },
  saveBtn:        { borderRadius:14, overflow:'hidden',
                    shadowColor:'#10B981', shadowOffset:{width:0,height:6}, shadowOpacity:0.5, shadowRadius:12, elevation:8 },
  saveBtnGrad:    { paddingVertical:17, alignItems:'center' },
  saveBtnText:    { fontSize:16, fontWeight:'700', color:'#fff' },
  mealItem:       { flexDirection:'row', gap:12, alignItems:'center',
                    backgroundColor:'#12121A', borderRadius:12, padding:14, marginBottom:8,
                    borderWidth:1, borderColor:'#1F2937' },
  mealEmoji:      { fontSize:24 },
  mealInfo:       { flex:1 },
  mealName:       { fontSize:14, color:'#fff', fontWeight:'500' },
  mealCals:       { fontSize:12, color:'#10B981', marginTop:2 },
});