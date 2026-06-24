import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PersonalInfoScreen from '../screens/onboarding/PersonalInfoScreen';
import LifestyleScreen    from '../screens/onboarding/LifestyleScreen';
import GoalsScreen        from '../screens/onboarding/GoalsScreen';
import SetupCompleteScreen from '../screens/onboarding/SetupCompleteScreen';

const Stack = createStackNavigator();
export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="PersonalInfo"  component={PersonalInfoScreen} />
      <Stack.Screen name="Lifestyle"     component={LifestyleScreen} />
      <Stack.Screen name="Goals"         component={GoalsScreen} />
      <Stack.Screen name="SetupComplete" component={SetupCompleteScreen} />
    </Stack.Navigator>
  );
}