import { Image, ImageProps, ImageSourcePropType } from "react-native";
import { AXIOS_BASE_URL } from "@env";
import { PetType, UserType } from "../types/types";

const defaultUser = require("../../assets/icon.png");
const defaultDog = require("../../assets/icon.png");
const defaultCat = require("../../assets/icon.png");
const defaultBird = require("../../assets/icon.png");
const defaultRabbit = require("../../assets/icon.png");

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
      uri: AXIOS_BASE_URL + "/images/" + imageId,
      method: "GET",
    };
  };

  const getDefaultImage = () => {
    switch (defaultImage) {
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
    }
  };

  return (
    <Image {...props} source={imageId ? getImageSource() : getDefaultImage()} />
  );
}
