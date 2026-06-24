import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SPACING, RADIUS } from './constants/theme';

const { width, height } = Dimensions.get('window');
const SLIDES = [
  { emoji: '🌟', title: 'Meet your personal\nhealth companion.', sub: 'Aurora understands you.' },
  { emoji: '💧', title: 'Track hydration, sleep,\nhabits & nutrition.', sub: 'All in one place.' },
  { emoji: '🧠', title: 'Receive personalized\ndaily insights.', sub: 'Know what your data means.' },
  { emoji: '🔥', title: 'Build healthier routines\nthrough consistency.', sub: 'Streaks keep you going.' },
  { emoji: '🌱', title: 'Learn more about\nyourself every day.', sub: 'Aurora grows with you.' },
];

export default function LandingScreen({ navigation }) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      Animated.sequence([
        Animated.timing(slideOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(slideOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <LinearGradient colors={['#0A0A0F', '#12091F', '#0A0A0F']} style={styles.container}>
      {/* Aurora glow effect */}
      <View style={styles.glowContainer}>
        <View style={[styles.glow, styles.glow1]} />
        <View style={[styles.glow, styles.glow2]} />
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoRing}>
            <LinearGradient colors={['#7C3AED', '#06B6D4']} style={styles.logoGrad}>
              <Text style={styles.logoEmoji}>✦</Text>
            </LinearGradient>
          </View>
          <Text style={styles.logoText}>Aurora</Text>
          <Text style={styles.tagline}>Understand yourself better every day.</Text>
        </View>

        {/* Sliding feature cards */}
        <Animated.View style={[styles.slideCard, { opacity: slideOpacity }]}>
          <Text style={styles.slideEmoji}>{slide.emoji}</Text>
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideSub}>{slide.sub}</Text>
        </Animated.View>

        {/* Dot indicators */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentSlide && styles.dotActive]} />
          ))}
        </View>

        {/* CTA Buttons */}
        <View style={styles.btnGroup}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.navigate('Signup')}>
            <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.btnGrad}>
              <Text style={styles.btnPrimaryText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnSecondaryText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  glowContainer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
  glow:          { position: 'absolute', borderRadius: 9999, opacity: 0.12 },
  glow1:         { width: 400, height: 400, backgroundColor: '#7C3AED', top: -80, left: -100 },
  glow2:         { width: 300, height: 300, backgroundColor: '#06B6D4', bottom: 40, right: -80 },
  content:       { width: '100%', alignItems: 'center', paddingHorizontal: 32 },
  logoArea:      { alignItems: 'center', marginBottom: 48 },
  logoRing:      { width: 80, height: 80, borderRadius: 24, overflow: 'hidden', marginBottom: 16,
                   shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 16, elevation: 12 },
  logoGrad:      { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoEmoji:     { fontSize: 36, color: '#fff' },
  logoText:      { fontSize: 38, fontWeight: '700', color: '#fff', letterSpacing: 2, marginBottom: 8 },
  tagline:       { fontSize: 14, color: '#9CA3AF', letterSpacing: 0.5, textAlign: 'center' },
  slideCard:     { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 28,
                   width: '100%', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  slideEmoji:    { fontSize: 44, marginBottom: 12 },
  slideTitle:    { fontSize: 20, fontWeight: '600', color: '#fff', textAlign: 'center', lineHeight: 28, marginBottom: 8 },
  slideSub:      { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
  dots:          { flexDirection: 'row', gap: 6, marginBottom: 40 },
  dot:           { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotActive:     { backgroundColor: '#7C3AED', width: 18 },
  btnGroup:      { width: '100%', gap: 12 },
  btnPrimary:    { borderRadius: 16, overflow: 'hidden',
                   shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  btnGrad:       { paddingVertical: 18, alignItems: 'center' },
  btnPrimaryText:{ fontSize: 17, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  btnSecondary:  { paddingVertical: 16, alignItems: 'center' },
  btnSecondaryText: { fontSize: 15, color: '#9CA3AF', fontWeight: '500' },
});