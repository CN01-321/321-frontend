import { PropsWithChildren } from "react";
import { ImageSourcePropType, StyleSheet, View } from "react-native";
import { Card } from "react-native-paper";
import DynamicCardCover from "../DynamicCardCover";

interface BaseRequestCardProps {
  pfp?: string;
  defaultPfp: ImageSourcePropType;
  onPress?: () => void;
}

export default function BaseRequestCard({
  pfp,
  defaultPfp,
  onPress,
  children,
}: BaseRequestCardProps & PropsWithChildren) {
  return (
    <Card onPress={onPress} style={styles.requestCard}>
      <View style={styles.requestCardContainer}>
        <DynamicCardCover
          imageId={pfp}
          defaultImage={defaultPfp}
          style={{ width: "30%" }}
        />
        <View style={{ flex: 1 }}>{children}</View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  requestCard: {
    overflow: "hidden",
    marginHorizontal: 15,
    marginVertical: 15,
  },
  requestCardContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    minheight: 200,
  },
});
