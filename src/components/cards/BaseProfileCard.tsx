/**
 * @file Base card component that contains a profile picture
 * @author George Bull
 */

import { PropsWithChildren } from "react";
import { View, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import DynamicCardCover from "../DynamicCardCover";

export interface BaseProfileCardProps extends PropsWithChildren {
  pfp?: string;
  onPress?: () => void;
}

export default function BaseProfileCard({
  pfp,
  onPress,
  children,
}: BaseProfileCardProps) {
  return (
    <Card onPress={onPress} style={styles.requestCard}>
      <View style={styles.requestCardContainer}>
        <DynamicCardCover
          imageId={pfp}
          defaultImage="user"
          borderRadius={0}
          style={{ width: "40%", borderRadius: 0 }}
        />
        <View style={{ flex: 1, padding: 15 }}>{children}</View>
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
    height: 200,
  },
});
