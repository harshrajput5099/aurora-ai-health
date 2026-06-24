import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import HomeScreen       from '../screens/main/HomeScreen';
import TrackingNavigator from './TrackingNavigator';
import CompanionScreen  from '../screens/main/CompanionScreen';
import ProfileScreen    from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  Home:    { active: '🏠', inactive: '🏡' },
  Track:   { active: '📊', inactive: '📈' },
  Aurora:  { active: '🌌', inactive: '🌌' },
  Profile: { active: '👤', inactive: '🧑' },
};

function TabIcon({ name, focused }) {
  return (
    <View style={[styles.icon, focused && styles.iconActive]}>
      <Text style={styles.emoji}>{ICONS[name][focused ? 'active' : 'inactive']}</Text>
    </View>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown:           false,
      tabBarStyle:           styles.tabBar,
      tabBarLabelStyle:      styles.label,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
    }}>
      <Tab.Screen name="Home"    component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} /> }} />
      <Tab.Screen name="Track"   component={TrackingNavigator}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Track" focused={focused} /> }} />
      <Tab.Screen name="Aurora"  component={CompanionScreen}
        options={{ tabBarLabel: 'Aurora AI', tabBarIcon: ({ focused }) => <TabIcon name="Aurora" focused={focused} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar:    { backgroundColor: COLORS.surface, borderTopColor: COLORS.border, height: 85, paddingBottom: 20 },
  label:     { fontSize: 10, fontWeight: '500' },
  icon:      { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  iconActive: { backgroundColor: `${COLORS.primary}25` },
  emoji:     { fontSize: 22 },
});