import { ImageSourcePropType } from "react-native";
import { Avatar } from "react-native-paper";
import { AXIOS_BASE_URL } from "@env";

interface DynamicAvatarProps {
  pfp?: string;
  defaultPfp: ImageSourcePropType;
  size?: number;
}

export default function DynamicAvatar({
  pfp,
  defaultPfp,
  size,
}: DynamicAvatarProps) {
  const getImageSource = (): ImageSourcePropType => {
    return {
      uri: AXIOS_BASE_URL + "/images/" + pfp,
    };
  };

  return (
    <Avatar.Image source={pfp ? getImageSource() : defaultPfp} size={size} />
  );
}