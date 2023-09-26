import { Image, ImageRequireSource, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import BaseProfileCard, { BaseProfileCardProps } from "./BaseProfileCard";

interface BaseRequestCardProps extends BaseProfileCardProps {
  title: string;
  name: string;
  paw: ImageRequireSource;
}

export default function BaseRequestCard({
  title,
  name,
  pfp,
  onPress,
  paw,
  children,
}: BaseRequestCardProps) {
  return (
    <BaseProfileCard pfp={pfp} onPress={onPress}>
      <Text variant="titleLarge" style={{ maxWidth: "80%" }}>
        {title}
      </Text>
      <Image source={paw} style={styles.pawImage} />
      <View style={{ flex: 1, flexShrink: 1, justifyContent: "space-evenly" }}>
        <Text variant="bodyLarge">{name}</Text>
        {children}
      </View>
    </BaseProfileCard>
  );
}

const styles = StyleSheet.create({
  pawImage: {
    width: 60,
    height: 60,
    position: "absolute",
    right: -2,
    top: 20,
  },
});
