import { View } from "react-native";
import { Avatar } from "react-native-paper";

export function StarRating({ stars }: { stars: number }) {
  const star = <Avatar.Icon icon={"star"} size={20} />;

  return (
    <View style={{ flexDirection: "row" }}>
      {stars > 0 && star}
      {stars > 1 && star}
      {stars > 2 && star}
      {stars > 3 && star}
      {stars > 4 && star}
    </View>
  );
}
