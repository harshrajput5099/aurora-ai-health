import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TrackingHomeScreen from '../screens/main/TrackingHomeScreen';
import HydrationScreen    from '../screens/main/HydrationScreen';
import SleepScreen        from '../screens/main/SleepScreen';
import HabitsScreen       from '../screens/main/HabitsScreen';
import NutritionScreen    from '../screens/main/NutritionScreen';

const Stack = createStackNavigator();
export default function TrackingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrackingHome" component={TrackingHomeScreen} />
      <Stack.Screen name="Hydration"    component={HydrationScreen} />
      <Stack.Screen name="Sleep"        component={SleepScreen} />
      <Stack.Screen name="Habits"       component={HabitsScreen} />
      <Stack.Screen name="Nutrition"    component={NutritionScreen} />
    </Stack.Navigator>
  );
}