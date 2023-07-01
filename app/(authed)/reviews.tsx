import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface Review {
  reviewerId: string;
  reviewerIcon: string;
  date: Date;
  rating: number;
  message: string;
  image?: string;
  likes: number;
  commentCount: number;
}

export default function Reviews() {
  const { userId } = useLocalSearchParams<{ userId: string }>();

  return (
    <View>
      <Text>Reviews</Text>
    </View>
  );
}
