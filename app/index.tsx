import { useRouter } from "expo-router";
import { View } from "react-native";
import { Title, Button } from "react-native-paper"

export default function Main() {
  const router = useRouter();

  return (
      <View>
        <Title>Pet Carer</Title>
        <Button 
          onPress={() => router.push('/signup')}
          mode="contained"
        >
          Sign Up
        </Button>
      </View>
  );
}
