import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';

export default function ProfileScreen() {
  const { userProfile, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || '—'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0A0F','#0A0A0F']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <LinearGradient colors={['#7C3AED','#5B21B6']} style={styles.avatarGrad}>
              <Text style={styles.avatarText}>{(userProfile?.name || 'A')[0].toUpperCase()}</Text>
            </LinearGradient>
          </View>
          <Text style={styles.name}>{userProfile?.name || 'Aurora User'}</Text>
          <Text style={styles.email}>{userProfile?.email || ''}</Text>
        </View>

        {/* Goals badges */}
        {(userProfile?.goals || []).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Goals</Text>
            <View style={styles.badges}>
              {(userProfile.goals || []).map(g => (
                <View key={g} style={styles.badge}>
                  <Text style={styles.badgeText}>{g.replace(/([A-Z])/g,' $1').trim()}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Personal info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            <InfoRow label="Age"    value={userProfile?.age ? `${userProfile.age} years` : null} />
            <InfoRow label="Height" value={userProfile?.height ? `${userProfile.height} cm` : null} />
            <InfoRow label="Weight" value={userProfile?.weight ? `${userProfile.weight} kg` : null} />
            <InfoRow label="Gender" value={userProfile?.gender} />
          </View>
        </View>

        {/* Lifestyle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lifestyle</Text>
          <View style={styles.card}>
            <InfoRow label="Wake-up"  value={userProfile?.wakeTime} />
            <InfoRow label="Bedtime"  value={userProfile?.bedTime} />
            <InfoRow label="Activity" value={userProfile?.activity} />
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {[
            { label:'🔔 Notifications', sub:'Reminders & insights' },
            { label:'📏 Units',         sub:'Metric / Imperial' },
            { label:'🔒 Privacy',       sub:'Data & security' },
          ].map(s => (
            <TouchableOpacity key={s.label} style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>{s.label}</Text>
                <Text style={styles.settingSub}>{s.sub}</Text>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Aurora v1.0  •  Built with ❤️</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex:1, backgroundColor:COLORS.background },
  scroll:       { paddingHorizontal:20, paddingTop:60, paddingBottom:40 },
  avatarSection: { alignItems:'center', marginBottom:32 },
  avatar:       { width:80, height:80, borderRadius:28, overflow:'hidden', marginBottom:12,
                  shadowColor:'#7C3AED', shadowOffset:{width:0,height:8}, shadowOpacity:0.5, shadowRadius:16, elevation:12 },
  avatarGrad:   { flex:1, justifyContent:'center', alignItems:'center' },
  avatarText:   { fontSize:34, fontWeight:'800', color:'#fff' },
  name:         { fontSize:22, fontWeight:'700', color:'#fff', marginBottom:4 },
  email:        { fontSize:14, color:'#9CA3AF' },
  section:      { marginBottom:24 },
  sectionTitle: { fontSize:15, fontWeight:'700', color:'#fff', marginBottom:12 },
  card:         { backgroundColor:'#12121A', borderRadius:16, overflow:'hidden', borderWidth:1, borderColor:'#1F2937' },
  infoRow:      { flexDirection:'row', justifyContent:'space-between', paddingHorizontal:16, paddingVertical:14,
                  borderBottomWidth:1, borderBottomColor:'#1F2937' },
  infoLabel:    { fontSize:14, color:'#9CA3AF' },
  infoValue:    { fontSize:14, fontWeight:'600', color:'#fff' },
  badges:       { flexDirection:'row', flexWrap:'wrap', gap:8 },
  badge:        { backgroundColor:'rgba(124,58,237,0.15)', paddingHorizontal:14, paddingVertical:7,
                  borderRadius:20, borderWidth:1, borderColor:'rgba(124,58,237,0.3)' },
  badgeText:    { fontSize:12, color:'#A78BFA', fontWeight:'600', textTransform:'capitalize' },
  settingRow:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center',
                  backgroundColor:'#12121A', borderRadius:14, padding:16, marginBottom:8,
                  borderWidth:1, borderColor:'#1F2937' },
  settingLabel: { fontSize:14, fontWeight:'600', color:'#fff' },
  settingSub:   { fontSize:12, color:'#9CA3AF', marginTop:2 },
  settingArrow: { fontSize:22, color:'#4B5563' },
  logoutBtn:    { backgroundColor:'rgba(239,68,68,0.1)', borderRadius:14, padding:16, alignItems:'center',
                  borderWidth:1, borderColor:'rgba(239,68,68,0.3)', marginBottom:24 },
  logoutText:   { color:'#EF4444', fontWeight:'700', fontSize:15 },
  footer:       { textAlign:'center', fontSize:12, color:'#4B5563' },
});