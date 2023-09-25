import { Image, ImageProps, ImageSourcePropType } from "react-native";
import { AXIOS_BASE_URL } from "@env";

interface DynamicCardCoverProps extends Omit<ImageProps, "source"> {
  imageId?: string;
  defaultImage: ImageSourcePropType;
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

  return (
    <Image {...props} source={imageId ? getImageSource() : defaultImage} />
  );
}
