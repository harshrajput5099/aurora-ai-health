import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/theme';

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export default function PersonalInfoScreen({ navigation }) {
  const [name, setName]     = useState('');
  const [age, setAge]       = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const next = () => {
    if (!name.trim()) return;
    navigation.navigate('Lifestyle', { personalInfo: { name, age, gender, height, weight } });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F', '#12091F']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Progress */}
        <View style={styles.progress}>
          {[1,2,3].map(i => (
            <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
          ))}
        </View>

        <Text style={styles.step}>Step 1 of 3</Text>
        <Text style={styles.title}>Tell us about you</Text>
        <Text style={styles.sub}>Aurora personalizes everything based on you</Text>

        <Text style={styles.label}>Your Name *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName}
          placeholder="What should Aurora call you?" placeholderTextColor={COLORS.textMuted} />

        <Text style={styles.label}>Age</Text>
        <TextInput style={styles.input} value={age} onChangeText={setAge}
          placeholder="e.g. 28" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.chips}>
          {GENDERS.map(g => (
            <TouchableOpacity key={g} onPress={() => setGender(g)}
              style={[styles.chip, gender === g && styles.chipActive]}>
              <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput style={styles.input} value={height} onChangeText={setHeight}
              placeholder="e.g. 175" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput style={styles.input} value={weight} onChangeText={setWeight}
              placeholder="e.g. 70" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" />
          </View>
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
  container: { flex: 1 },
  scroll:    { paddingHorizontal: 28, paddingTop: 60, paddingBottom: 40 },
  progress:  { flexDirection: 'row', gap: 8, marginBottom: 20 },
  dot:       { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#1F2937' },
  dotActive: { backgroundColor: '#7C3AED' },
  step:      { fontSize: 13, color: '#7C3AED', fontWeight: '600', marginBottom: 8 },
  title:     { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 8 },
  sub:       { fontSize: 14, color: '#9CA3AF', marginBottom: 28 },
  label:     { fontSize: 13, color: '#9CA3AF', fontWeight: '500', marginBottom: 6, marginTop: 12 },
  input:     { backgroundColor: '#12121A', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
               fontSize: 15, color: '#fff', borderWidth: 1, borderColor: '#1F2937' },
  chips:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip:      { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, backgroundColor: '#12121A',
               borderWidth: 1, borderColor: '#1F2937' },
  chipActive: { backgroundColor: '#4C1D95', borderColor: '#7C3AED' },
  chipText:   { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  row:       { flexDirection: 'row', gap: 12 },
  half:      { flex: 1 },
  btn:       { borderRadius: 14, overflow: 'hidden', marginTop: 32,
               shadowColor: '#7C3AED', shadowOffset:{width:0,height:6}, shadowOpacity:0.5, shadowRadius:12, elevation:8 },
  btnGrad:   { paddingVertical: 17, alignItems: 'center' },
  btnText:   { fontSize: 16, fontWeight: '700', color: '#fff' },
});