import { useLocalSearchParams, useRouter, Link, Stack } from "expo-router";
import { UserType } from "../../contexts/auth";
import { Text, Button } from "react-native-paper";
import { View } from "react-native";

export default function GetStarted() {
  const { userType } = useLocalSearchParams<{ userType: UserType }>();
  const router = useRouter();

  const colour = userType === "owner" ? "brown" : "yellow";

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Getting Started",
        }}
      />
      <Button
        mode="contained"
        onPress={() =>
          router.push({ pathname: "/(auth)/signup", params: { userType } })
        }
        theme={{ colors: { primary: colour } }}
      >
        Get Started
      </Button>
      <Text>Already registered?</Text>
      <Button
        mode="contained"
        onPress={() =>
          router.push({ pathname: "/(auth)/login", params: { userType } })
        }
        theme={{ colors: { primary: colour } }}
      >
        Login
      </Button>
    </View>
  );
}
