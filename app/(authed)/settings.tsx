import { StyleSheet, View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";
import { Stack } from "expo-router";

export default function Settings() {
  return (
    <>
      <Stack.Screen 
            options={{
              headerTitle: "Settings"
            }}
      />
      <View>
        <Text variant="titleLarge">Account</Text>
        <View style={styles.settingsButtonContainer}>
          <Button>Edit Personal Profile</Button>
          <Divider />
          <Button>Change Password</Button>
          <Divider />
          <Button>Log Out</Button>
          <Divider />
          <Button>Delete Account</Button>
        </View>

        <Text variant="titleLarge">About</Text>
        <View style={styles.settingsButtonContainer}>
          <Button>Contact Us</Button>
          <Divider />
          <Button>About Us</Button>
          <Divider />
          <Button>Terms of Use</Button>
          <Divider />
          <Button>Privacy Policy</Button>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  settingsButtonContainer: {
    backgroundColor: "white"
  }
});