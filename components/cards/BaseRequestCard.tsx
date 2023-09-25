import { PropsWithChildren } from "react";
import {
  Image,
  ImageRequireSource,
  ImageSourcePropType,
  StyleSheet,
  View,
} from "react-native";
import { Card, Text } from "react-native-paper";
import DynamicCardCover from "../DynamicCardCover";

interface BaseRequestCardProps {
  title: string;
  name: string;
  pfp?: string;
  defaultPfp: ImageSourcePropType;
  onPress?: () => void;
  paw: ImageRequireSource;
}

export default function BaseRequestCard({
  title,
  name,
  pfp,
  defaultPfp,
  onPress,
  paw,
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
        <View style={{ flex: 1, padding: 15 }}>
          <Image source={paw} style={styles.pawImage} />
          <Text variant="titleLarge" style={{ maxWidth: "80%" }}>
            {title}
          </Text>
          <View
            style={{ flex: 1, flexShrink: 1, justifyContent: "space-evenly" }}
          >
            <Text variant="bodyLarge">{name}</Text>
            {children}
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  requestCard: {
    overflow: "hidden",
    marginHorizontal: 15,
    marginVertical: 10,
    borderColor: "#CAC4D0",
    borderWidth: 1.5,
  },
  requestCardContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    minheight: 150,
  },
  infoItem: {
    paddingVertical: 5,
  },
  pawImage: {
    width: 60,
    height: 60,
    position: "absolute",
    right: -2,
    top: 20,
  },
});
