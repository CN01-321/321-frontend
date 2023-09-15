import { View } from "react-native";
import Star from "./Star";

export function StarRating({ stars, size }: { stars: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row" }}>
      <Star size={size ?? 25} colour={stars > 0 ? "yellow" : "grey"} />
      <Star size={size ?? 25} colour={stars > 1 ? "yellow" : "grey"} />
      <Star size={size ?? 25} colour={stars > 2 ? "yellow" : "grey"} />
      <Star size={size ?? 25} colour={stars > 3 ? "yellow" : "grey"} />
      <Star size={size ?? 25} colour={stars > 4 ? "yellow" : "grey"} />
    </View>
  );
}
