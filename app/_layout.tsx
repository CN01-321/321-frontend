import { Link, Slot, Stack, useRouter, useSegments } from 'expo-router';
import { MD3LightTheme as DefaultTheme, PaperProvider, Text, BottomNavigation, Appbar} from 'react-native-paper';
import { useState } from 'react';
import { AuthProvider } from '../contexts/auth';

// here is where the themes settings can be changed
const theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: 'red',
    secondary: 'yellow'
    
  },
  background : "red"
}

export default function Layout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </PaperProvider>
  );
}
