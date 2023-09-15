import { View } from "react-native";
import { Title, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import Header from "../../components/Header";
import { CARER_COLOUR, OWNER_COLOUR } from "../../types/types";

export default function Landing() {
  const router = useRouter();

  return (
    <View>
      <Header title="Welcome" />
      <Title>Landing page</Title>

      <Button
        mode="contained"
        theme={{ colors: { primary: OWNER_COLOUR } }}
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
        theme={{ colors: { primary: CARER_COLOUR } }}
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
