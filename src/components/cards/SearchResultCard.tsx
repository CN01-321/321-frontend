import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { NearbyCarer } from "../../types/types";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import Star from "../Star";
import { useRouter } from "expo-router";
import BaseProfileCard from "./BaseProfileCard";

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
    <BaseProfileCard
      pfp={carer.pfp}
      onPress={() =>
        router.push({
          pathname: "/profile/overview",
          params: { profileId: carer._id },
        })
      }
    >
      <View style={styles.titleArea}>
        <Text variant="titleLarge" style={{ maxWidth: "80%", flexShrink: 1 }}>
          {carer.name}
        </Text>
        {carer.rating ? (
          <>
            <View style={{ paddingLeft: 10 }}>
              <Star size={10} />
            </View>
            <Text variant="bodyMedium">{carer.rating.toFixed(1)}</Text>
          </>
        ) : null}
      </View>
      <View style={{ flex: 1, justifyContent: "space-evenly" }}>
        <Text variant="bodyMedium">{carer.totalReviews} Reviews</Text>
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
        <Button mode="contained" onPress={handleRequest}>
          Request Service
        </Button>
      </View>
    </BaseProfileCard>
  );
}

const styles = StyleSheet.create({
  titleArea: {
    paddingTop: 5,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
});
