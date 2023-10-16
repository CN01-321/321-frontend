/**
 * @file Component to show a user/pet's pfp as a circle
 * @author George Bull
 */

import { ImageURISource } from "react-native";
import { Avatar } from "react-native-paper";
import { PetType, UserType } from "../types/types";

type DefaultPfpType = "user" | UserType | PetType;

interface DynamicAvatarProps {
  pfp?: string | ImageURISource;
  defaultPfp: DefaultPfpType;
  size?: number;
}

export default function DynamicAvatar({
  pfp,
  defaultPfp,
  size,
}: DynamicAvatarProps) {
  const getImageSource = (): ImageURISource => {
    // return pfp as is if it is a ImageURISource
    if (typeof pfp === "object") {
      return pfp;
    }

    // otherwise convert it to an ImageUriSource
    return {
      uri: process.env.AXIOS_BASE_URL + "/images/" + pfp,
    };
  };

  const getDefaultPfp = () => {
    switch (defaultPfp) {
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

  return (
    <Avatar.Image
      source={pfp ? getImageSource() : getDefaultPfp()}
      size={size}
    />
  );
}
