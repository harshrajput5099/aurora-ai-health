import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useHealth } from '../../context/HealthContext';
import { sendMessageToAurora } from '../../services/aiService';
import voiceService from '../../services/voiceService';
import { COLORS } from '../../constants/theme';

const SUGGESTIONS = [
  'How am I doing today?',
  'Did I drink enough water?',
  'How can I improve my sleep?',
  'What habits should I focus on?',
];

export default function CompanionScreen() {
  const { getHealthContext, addWater, logSleep, createHabit, completeHabit } = useHealth();
  const [messages,    setMessages]    = useState([
    { role:'assistant', text:'Hi! I\'m Aurora 🌌 Your personal health companion. Ask me anything about your health, or tell me what you did today!' }
  ]);
  const [input,       setInput]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking,  setIsSpeaking]  = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef(null);
  const history   = useRef([]);

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,   duration: 700, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  const scrollToBottom = () =>
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

  const executeAction = async (action) => {
  if (!action) return;
  try {
    switch (action.type) {
      case 'addWater':
        await addWater(action.data.amount);
        break;
      case 'logSleep':
        await logSleep(action.data.hours);
        break;
      case 'createHabit':
        await createHabit(action.data.name, 'daily', action.data.icon || '⭐');
        break;
      case 'completeHabit': {
        const h = habits.find(x =>
          x.name.toLowerCase().includes((action.data.habitName || '').toLowerCase())
        );
        if (h) await completeHabit(h.id);
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error('Action error:', e);
  }
};

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role:'user', text:msg }]);
    scrollToBottom();
    setLoading(true);

    const userMsg = { role:'user', content: msg };
    history.current = [...history.current, userMsg];

    try {
      const ctx = getHealthContext();
      const res = await sendMessageToAurora(msg, ctx, history.current);

      const assistantMsg = { role:'assistant', content: res.message };
      history.current = [...history.current, assistantMsg];

      setMessages(prev => [...prev, { role:'assistant', text: res.message }]);
      scrollToBottom();

      // Execute any action
      if (res.action) await executeAction(res.action);

      // Speak the response
      setIsSpeaking(true);
      voiceService.speak(res.message, () => setIsSpeaking(true), () => setIsSpeaking(false));
    } finally { setLoading(false); }
  };

  const toggleVoice = async () => {
    if (isRecording) {
      setIsRecording(false);
      try {
        const uri = await voiceService.stopRecording();
        if (!uri) return;
        setLoading(true);
        const transcript = await voiceService.transcribeAudio(uri);
        if (transcript?.trim()) {
          await sendMessage(transcript);
        } else {
          setMessages(prev => [...prev, { role:'assistant', text:"I couldn't catch that. Try again! 🎤" }]);
        }
      } catch(e) {
        setMessages(prev => [...prev, { role:'assistant', text:"Mic error — please try typing instead." }]);
      } finally { setLoading(false); }
    } else {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await voiceService.startRecording();
        setIsRecording(true);
      } catch(e) {
        setMessages(prev => [...prev, { role:'assistant', text:"Can't access microphone. Please grant permission in settings." }]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F','#0A0A0F']} style={StyleSheet.absoluteFill} />

      {/* Header */}
      <LinearGradient colors={['#12091F','#0A0A0F']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.auraAvatar}>
            <LinearGradient colors={['#7C3AED','#06B6D4']} style={styles.auraAvatarGrad}>
              <Text style={styles.auraAvatarText}>✦</Text>
            </LinearGradient>
          </View>
          <View>
            <Text style={styles.headerName}>Aurora</Text>
            <Text style={styles.headerSub}>
              {isSpeaking ? '🔊 Speaking…' : isRecording ? '🔴 Listening…' : 'Your health companion'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Messages */}
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.messages} keyboardShouldPersistTaps="handled">
          {messages.map((m, i) => (
            <View key={i} style={[styles.bubble, m.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              {m.role === 'assistant' && (
                <View style={styles.aiIcon}><Text style={styles.aiIconText}>✦</Text></View>
              )}
              <View style={[styles.bubbleContent, m.role === 'user' ? styles.userContent : styles.aiContent]}>
                <Text style={[styles.bubbleText, m.role === 'user' && styles.userText]}>{m.text}</Text>
              </View>
            </View>
          ))}
          {loading && (
            <View style={styles.bubble}>
              <View style={styles.aiIcon}><Text style={styles.aiIconText}>✦</Text></View>
              <View style={styles.aiContent}>
                <Text style={styles.bubbleText}>Aurora is thinking…</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Suggestion chips */}
        {messages.length === 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestions}>
            {SUGGESTIONS.map(s => (
              <TouchableOpacity key={s} style={styles.suggChip} onPress={() => sendMessage(s)}>
                <Text style={styles.suggChipText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput style={styles.textInput} value={input} onChangeText={setInput}
            placeholder="Ask Aurora anything…" placeholderTextColor="#6B7280"
            returnKeyType="send" onSubmitEditing={() => sendMessage()}
            editable={!loading && !isRecording} />

          {/* Send button */}
          <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage()} disabled={loading || !input.trim()}>
            <LinearGradient colors={['#7C3AED','#5B21B6']} style={styles.sendBtnGrad}>
              <Text style={styles.sendBtnText}>↑</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Voice button */}
          <Animated.View style={{ transform:[{ scale: pulseAnim }] }}>
            <TouchableOpacity style={[styles.micBtn, isRecording && styles.micBtnActive]} onPress={toggleVoice}>
              <LinearGradient
                colors={isRecording ? ['#EF4444','#DC2626'] : ['#06B6D4','#0891B2']}
                style={styles.micBtnGrad}>
                <Text style={styles.micBtnText}>{isRecording ? '⏹' : '🎤'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex:1, backgroundColor:COLORS.background },
  header:      { paddingTop:60, paddingBottom:16, paddingHorizontal:20, borderBottomWidth:1, borderBottomColor:COLORS.border },
  headerContent: { flexDirection:'row', alignItems:'center', gap:12 },
  auraAvatar:  { width:44, height:44, borderRadius:16, overflow:'hidden' },
  auraAvatarGrad: { flex:1, justifyContent:'center', alignItems:'center' },
  auraAvatarText: { fontSize:20, color:'#fff' },
  headerName:  { fontSize:18, fontWeight:'700', color:'#fff' },
  headerSub:   { fontSize:12, color:COLORS.textSecondary, marginTop:2 },
  messages:    { paddingHorizontal:16, paddingVertical:20, gap:12 },
  bubble:      { flexDirection:'row', alignItems:'flex-end', gap:8 },
  userBubble:  { flexDirection:'row-reverse' },
  aiIcon:      { width:28, height:28, borderRadius:10, backgroundColor:'rgba(124,58,237,0.25)',
                 justifyContent:'center', alignItems:'center', marginBottom:2 },
  aiIconText:  { fontSize:12, color:'#A78BFA' },
  bubbleContent: { maxWidth:'80%', borderRadius:16, padding:13 },
  aiContent:   { backgroundColor:COLORS.surface, borderBottomLeftRadius:4, borderWidth:1, borderColor:COLORS.border },
  userContent: { backgroundColor:'#5B21B6', borderBottomRightRadius:4 },
  bubbleText:  { fontSize:14, color:'#fff', lineHeight:20 },
  userText:    { color:'#fff' },
  suggestions: { paddingHorizontal:16, paddingBottom:12, gap:8 },
  suggChip:    { backgroundColor:COLORS.surface, borderRadius:20, paddingHorizontal:14, paddingVertical:8,
                 borderWidth:1, borderColor:COLORS.border },
  suggChipText: { fontSize:13, color:COLORS.textSecondary },
  inputBar:    { flexDirection:'row', alignItems:'center', gap:8, padding:12, paddingBottom:28,
                 borderTopWidth:1, borderTopColor:COLORS.border, backgroundColor:COLORS.surface },
  textInput:   { flex:1, backgroundColor:COLORS.background, borderRadius:24, paddingHorizontal:16,
                 paddingVertical:12, fontSize:14, color:'#fff', borderWidth:1, borderColor:COLORS.border },
  sendBtn:     { width:44, height:44, borderRadius:22, overflow:'hidden' },
  sendBtnGrad: { flex:1, justifyContent:'center', alignItems:'center' },
  sendBtnText: { fontSize:20, color:'#fff', fontWeight:'700' },
  micBtn:      { width:44, height:44, borderRadius:22, overflow:'hidden' },
  micBtnActive: { shadowColor:'#EF4444', shadowOffset:{width:0,height:0}, shadowOpacity:0.8, shadowRadius:8, elevation:8 },
  micBtnGrad:  { flex:1, justifyContent:'center', alignItems:'center' },
  micBtnText:  { fontSize:18 },
});