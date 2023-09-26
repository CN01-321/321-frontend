import { ImageURISource } from "react-native";
import { Avatar } from "react-native-paper";
import { AXIOS_BASE_URL } from "@env";
import { PetType, UserType } from "../types/types";

const defaultUser = require("../../assets/icon.png");
const defaultDog = require("../../assets/icon.png");
const defaultCat = require("../../assets/icon.png");
const defaultBird = require("../../assets/icon.png");
const defaultRabbit = require("../../assets/icon.png");

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
      uri: AXIOS_BASE_URL + "/images/" + pfp,
    };
  };

  const getDefaultPfp = () => {
    switch (defaultPfp) {
      case "user":
      case "owner":
      case "carer":
        return defaultUser;
      case "dog":
        return defaultDog;
      case "cat":
        return defaultCat;
      case "bird":
        return defaultBird;
      case "rabbit":
        return defaultRabbit;
      default:
    }
  };

  return (
    <Avatar.Image
      source={pfp ? getImageSource() : getDefaultPfp()}
      size={size}
    />
  );
}
