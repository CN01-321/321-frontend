/**
 * @file Component to show a user/pet's pfp as a card cover
 * @author George Bull
 */

import { Image, ImageProps, ImageSourcePropType } from "react-native";
import { PetType, UserType } from "../types/types";

type DefaultImageType = "user" | UserType | PetType;

interface DynamicCardCoverProps extends Omit<ImageProps, "source"> {
  imageId?: string;
  defaultImage: DefaultImageType;
}

export default function DynamicCardCover({
  imageId,
  defaultImage,
  ...props
}: DynamicCardCoverProps) {
  const getImageSource = (): ImageSourcePropType => {
    return {
      uri: process.env.AXIOS_BASE_URL + "/images/" + imageId,
      method: "GET",
    };
  };

  const getDefaultImage = () => {
    switch (defaultImage) {
      case "user":
        return require("../../assets/icons/defaultuser.png");
      case "dog":
        return require("../../assets/icons/defaultdog.png");
      case "cat":
        return require("../../assets/icons/defaultcat.png");
      case "bird":
        return require("../../assets/icons/defaultbird.png");
      case "rabbit":
        return require("../../assets/icons/defaultrabbit.png");
      default:
        return require("../../assets/icons/defaultuser.png");
    }
  };

  if (imageId) {
    return <Image {...props} source={getImageSource()} />;
  }

  return (
    <Image
      {...props}
      source={getDefaultImage()}
      style={{
        transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }, { translateY: 15 }],
      }}
    />
  );
}
