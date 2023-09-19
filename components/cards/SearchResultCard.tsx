import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { NearbyCarer } from "../../types/types";
import BaseRequestCard from "./BaseRequestCard";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import Star from "../Star";
import { useRouter } from "expo-router";

const icon = require("../../assets/icon.png");

interface SearchResultCardProps {
  carer: NearbyCarer;
  onRequest: () => void;
}

export default function SearchResultCard({
  carer,
  onRequest,
}: SearchResultCardProps) {
  const theme = useTheme();
  const router = useRouter();

  const handleRequest = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onRequest();
  };

  return (
    <BaseRequestCard
      pfp={carer.pfp}
      defaultPfp={icon}
      onPress={() =>
        router.push({
          pathname: "/profile/overview",
          params: { profileId: carer._id },
        })
      }
    >
      <View style={{ flex: 1, justifyContent: "space-evenly", padding: 20 }}>
        <View style={styles.infoArea}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text variant="titleLarge">{carer.name}</Text>
            </View>
            {carer.rating ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Star size={10} />
                <Text style={{ paddingLeft: 5 }} variant="bodyMedium">
                  {carer.rating.toFixed(1)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.infoArea}>
          <Text variant="bodyMedium">{carer.totalReviews} Reviews</Text>
        </View>
        <View style={styles.infoArea}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <IconButton
              style={{ paddingLeft: 0, marginLeft: 0 }}
              icon="crosshairs-gps"
              iconColor={theme.colors.primary}
              size={15}
            />
            <Text variant="bodyMedium">
              Distance: {(carer.distance / 1000).toFixed(1)} km
            </Text>
          </View>
        </View>
        <View style={styles.infoArea}>
          <Button mode="contained" onPress={handleRequest}>
            Request Service
          </Button>
        </View>
      </View>
    </BaseRequestCard>
  );
}

const styles = StyleSheet.create({
  infoArea: {},
});
