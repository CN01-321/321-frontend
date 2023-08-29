import { ImageSourcePropType } from "react-native";
import { AXIOS_BASE_URL } from "@env";
import { Card, CardCoverProps } from "react-native-paper";

interface DynamicCardCoverProps extends Omit<CardCoverProps, "source"> {
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
    <Card.Cover {...props} source={imageId ? getImageSource() : defaultImage} />
  );
}
