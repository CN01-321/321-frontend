import { useLocalSearchParams, useRouter, Link, Stack } from "expo-router";
import { CARER_COLOUR, OWNER_COLOUR, UserType } from "../../types";
import { Text, Button } from "react-native-paper";
import { View } from "react-native";
import Header from "../../components/Header";

export default function GetStarted() {
  const { userType } = useLocalSearchParams<{ userType: UserType }>();
  const router = useRouter();

  const colour = userType === "owner" ? OWNER_COLOUR : CARER_COLOUR;

  return (
    <View>
      <Header title="Get Started" />
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
