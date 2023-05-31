import { Slot } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export function Layout() {
    return (
        <>
            <Text>Some text above the page</Text>
            <Slot />
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});