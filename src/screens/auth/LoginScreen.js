import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter email and password.');
    setLoading(true);
    try { await login(email.trim().toLowerCase(), password); }
    catch (e) { Alert.alert('Login Failed', 'Incorrect email or password.'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#0A0A0F', '#12091F']} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.sub}>Sign in to continue your journey</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail}
          placeholder="you@example.com" placeholderTextColor={COLORS.textMuted}
          keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword}
          placeholder="Your password" placeholderTextColor={COLORS.textMuted}
          secureTextEntry />

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.btnGrad}>
            <Text style={styles.btnText}>{loading ? 'Signing in…' : 'Sign In'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? <Text style={styles.link}>Sign up</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content:   { flex: 1, paddingHorizontal: 28, paddingTop: 70, paddingBottom: 40 },
  back:      { marginBottom: 40 },
  backText:  { color: '#9CA3AF', fontSize: 15 },
  title:     { fontSize: 30, fontWeight: '700', color: '#fff', marginBottom: 8 },
  sub:       { fontSize: 15, color: '#9CA3AF', marginBottom: 36 },
  label:     { fontSize: 13, color: '#9CA3AF', fontWeight: '500', marginBottom: 6, marginTop: 12 },
  input:     { backgroundColor: '#12121A', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
               fontSize: 15, color: '#fff', borderWidth: 1, borderColor: '#1F2937' },
  btn:       { borderRadius: 14, overflow: 'hidden', marginTop: 28,
               shadowColor: '#7C3AED', shadowOffset: {width:0,height:6}, shadowOpacity:0.5, shadowRadius:12, elevation:8 },
  btnGrad:   { paddingVertical: 17, alignItems: 'center' },
  btnText:   { fontSize: 16, fontWeight: '700', color: '#fff' },
  footer:    { marginTop: 24, alignItems: 'center' },
  footerText: { color: '#9CA3AF', fontSize: 14 },
  link:      { color: '#7C3AED', fontWeight: '600' },
});