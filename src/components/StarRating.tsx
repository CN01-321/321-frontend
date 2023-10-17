/**
 * @file Input/view for rating profiles out of 5 stars
 * @author George Bull
 */

import { Pressable, View } from "react-native";
import Star from "./Star";

interface StarRatingProps {
  stars: number;
  size?: number;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({ stars, size, onRatingChange }: StarRatingProps) {
  const starComponents = () => {
    const components = [];

    for (let i = 0; i < 5; i++) {
      components.push(
        <Pressable
          key={i}
          onPress={() => {
            onRatingChange ? onRatingChange(i + 1) : null;
          }}
        >
          <Star size={size ?? 25} colour={stars > i ? "yellow" : "grey"} />
        </Pressable>
      );
    }

    return components;
  };

  return <View style={{ flexDirection: "row" }}>{starComponents()}</View>;
}
