import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SPACING, SIZES, RADIUS } from '../../constants/theme';

export default function SignupScreen({ navigation }) {
  const { signUp } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirm) return Alert.alert('Error', 'Please fill all fields.');
    if (password !== confirm)            return Alert.alert('Error', 'Passwords do not match.');
    if (password.length < 6)             return Alert.alert('Error', 'Password must be at least 6 characters.');
    setLoading(true);
    try {
      await signUp(email.trim().toLowerCase(), password);
    } catch (e) {
      Alert.alert('Signup Failed', e.message);
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#0A0A0F', '#12091F']} style={StyleSheet.absoluteFill} />
      <View style={styles.glow} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.sub}>Start your health journey with Aurora</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail}
            placeholder="you@example.com" placeholderTextColor={COLORS.textMuted}
            keyboardType="email-address" autoCapitalize="none" />

          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword}
            placeholder="At least 6 characters" placeholderTextColor={COLORS.textMuted}
            secureTextEntry />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput style={styles.input} value={confirm} onChangeText={setConfirm}
            placeholder="Repeat password" placeholderTextColor={COLORS.textMuted}
            secureTextEntry />

          <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={loading}>
            <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.btnGrad}>
              <Text style={styles.btnText}>{loading ? 'Creating account…' : 'Create Account'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}><View style={styles.line}/><Text style={styles.orText}>or</Text><View style={styles.line}/></View>

          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialText}>🔵  Continue with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialBtn, { marginTop: 8 }]}>
            <Text style={styles.socialText}>🍎  Continue with Apple</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? <Text style={styles.footerLink}>Sign in</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  glow:      { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: '#7C3AED', opacity: 0.08, top: -100, left: -50 },
  scroll:    { flexGrow: 1, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 40 },
  back:      { marginBottom: 32 },
  backText:  { color: COLORS.textSecondary, fontSize: 15 },
  header:    { marginBottom: 36 },
  title:     { fontSize: 30, fontWeight: '700', color: '#fff', marginBottom: 8 },
  sub:       { fontSize: 15, color: COLORS.textSecondary },
  form:      { gap: 4 },
  label:     { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500', marginTop: 12, marginBottom: 6 },
  input:     { backgroundColor: COLORS.surface, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
               fontSize: 15, color: '#fff', borderWidth: 1, borderColor: COLORS.border },
  btn:       { borderRadius: 14, overflow: 'hidden', marginTop: 24,
               shadowColor: '#7C3AED', shadowOffset: {width:0,height:6}, shadowOpacity:0.5, shadowRadius:12, elevation:8 },
  btnGrad:   { paddingVertical: 17, alignItems: 'center' },
  btnText:   { fontSize: 16, fontWeight: '700', color: '#fff' },
  divider:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  line:      { flex: 1, height: 1, backgroundColor: COLORS.border },
  orText:    { color: COLORS.textMuted, fontSize: 13 },
  socialBtn: { backgroundColor: COLORS.surface, borderRadius: 12, paddingVertical: 15, alignItems: 'center',
               borderWidth: 1, borderColor: COLORS.border },
  socialText: { fontSize: 15, color: '#fff', fontWeight: '500' },
  footer:    { marginTop: 28, alignItems: 'center' },
  footerText: { color: COLORS.textSecondary, fontSize: 14 },
  footerLink: { color: COLORS.primary, fontWeight: '600' },
});