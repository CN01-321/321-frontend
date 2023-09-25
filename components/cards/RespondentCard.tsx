import { Button, Text } from "react-native-paper";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { Respondent } from "../../types/types";
import { useRouter } from "expo-router";
import Star from "../Star";
import BaseProfileCard from "./BaseProfileCard";

const icon = require("../../assets/icon.png");

interface RespondentCardProps {
  respondent: Respondent;
  onHire: () => void;
}

export default function RespondentCard({
  respondent,
  onHire,
}: RespondentCardProps) {
  const router = useRouter();

  const routeToRespondent = () => {
    router.push({
      pathname: "/profile/overview",
      params: { profileId: respondent._id },
    });
  };

  const handleHireCarer = (e: GestureResponderEvent) => {
    e.stopPropagation();
    onHire();
  };

  return (
    <BaseProfileCard
      pfp={respondent.pfp}
      defaultPfp={icon}
      onPress={routeToRespondent}
    >
      <View style={styles.titleArea}>
        <Text variant="titleLarge">{respondent.name}</Text>
        {respondent.rating ? (
          <>
            <View style={{ paddingLeft: 10 }}>
              <Star size={15} />
            </View>
            <Text variant="bodyMedium">{respondent.rating.toFixed(1)}</Text>
          </>
        ) : null}
      </View>
      <View style={{ flex: 1, justifyContent: "space-evenly" }}>
        <Text variant="bodyLarge">{respondent.totalReviews} Reviews</Text>
        <Text variant="bodyLarge">${respondent.hourlyRate} p/h</Text>
        <Button mode="contained" onPress={handleHireCarer}>
          Hire Carer
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
