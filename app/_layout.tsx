import { Link, Stack, useRouter, useSegments } from 'expo-router';
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
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'home', title: 'Home', focusedIcon: 'home-circle', unfocused: 'home-circle-outline'},
    {key: 'landing', title: 'Landing', focusedIcon: 'airballoon', unfocused: 'airballoon-outline'}
  ]);
  const router = useRouter();
  

  const segments = useSegments();
  console.log(segments);

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Stack />
      </AuthProvider>
    </PaperProvider>
  );
}
