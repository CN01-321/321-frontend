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
        return require("../../assets/icons/defaultprofile/user.png");
      case "dog":
        return require("../../assets/icons/defaultprofile/dog.png");
      case "cat":
        return require("../../assets/icons/defaultprofile/cat.png");
      case "bird":
        return require("../../assets/icons/defaultprofile/bird.png");
      case "rabbit":
        return require("../../assets/icons/defaultprofile/rabbit.png");
      default:
        return require("../../assets/icons/defaultprofile/user.png");
    }
  };

  if (imageId) {
    return <Image {...props} source={getImageSource()} />;
  }

  return (
    <Image
      {...props}
      source={getDefaultImage()}
    />
  );
}
