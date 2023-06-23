import { Slot } from 'expo-router';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
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
