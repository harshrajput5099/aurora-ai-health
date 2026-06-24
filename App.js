import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { HealthProvider } from './src/context/HealthContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthProvider>
          <HealthProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </HealthProvider>
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}