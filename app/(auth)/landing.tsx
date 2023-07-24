import { View } from "react-native";
import { Title, Button } from "react-native-paper";
import { Stack, useRouter } from "expo-router";
import Header from "../../components/Header";

export default function Landing() {
  const router = useRouter();

  return (
    <View>
      <Header title="Welcome" />
      <Title>Landing page</Title>

      <Button
        mode="contained"
        theme={{ colors: { primary: "brown" } }}
        onPress={() =>
          router.push({
            pathname: "/(auth)/get-started",
            params: { userType: "owner" },
          })
        }
      >
        Pet Owner
      </Button>
      <Button
        mode="contained"
        theme={{ colors: { primary: "yellow" } }}
        onPress={() =>
          router.push({
            pathname: "/(auth)/get-started",
            params: { userType: "carer" },
          })
        }
      >
        Pet Carer
      </Button>
    </View>
  );
}
