import { ImageSourcePropType, ImageURISource } from "react-native";
import { Avatar } from "react-native-paper";
import { AXIOS_BASE_URL } from "@env";

interface DynamicAvatarProps {
  pfp?: string | ImageURISource;
  defaultPfp: ImageSourcePropType;
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

  return (
    <Avatar.Image source={pfp ? getImageSource() : defaultPfp} size={size} />
  );
}
