import { View } from "react-native";
import { Title, Text, Button } from "react-native-paper";
import { Link, useRouter } from "expo-router";

export default function Landing() {
  const router = useRouter();

  return (
    <View>
      <Title>Landing page</Title>

      <Button
        mode="contained"
        theme={{ colors: { primary: "brown" } }}
        onPress={() => router.push("/(auth)/owner/get-started")}
      >
        Pet Owner
      </Button>
      <Button
        mode="contained"
        theme={{ colors: { primary: "yellow" } }}
        onPress={() => router.push("/(auth)/carer/get-started")}
      >
        Pet Carer
      </Button>

      <Text>
        Already registered? <Link href="/login">Tap here to login</Link>
      </Text>
    </View>
  );
}
