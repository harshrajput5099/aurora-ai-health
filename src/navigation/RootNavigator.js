import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';
import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { user, isLoading, hasCompletedOnboarding } = useAuth();
  if (isLoading) return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor: COLORS.background }}>
      <ActivityIndicator color={COLORS.primary} size="large" />
    </View>
  );
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!user               ? <Stack.Screen name="Auth"        component={AuthNavigator}        /> :
       !hasCompletedOnboarding ? <Stack.Screen name="Onboarding"  component={OnboardingNavigator}  /> :
                                 <Stack.Screen name="Main"        component={MainNavigator}        />
      }
    </Stack.Navigator>
  );
}