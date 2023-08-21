import { FlatList, View, StyleSheet, ImageSourcePropType } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { StarRating } from "./StarRating";
import { Link } from "expo-router";
import { getPfpUrl } from "../utils";

const icon = require("../assets/icon.png");

export interface CarerResult {
  _id: string;
  name: string;
  rating?: number;
  bio?: string;
  pfp?: string;
}

interface CarerResultsViewProps {
  carerResults: CarerResult[];
  handleRequest: (carerResult: CarerResult) => void;
  cardButtonLabel: string;
}

export default function CarerResultsView({
  carerResults,
  handleRequest,
  cardButtonLabel,
}: CarerResultsViewProps) {
  return (
    <FlatList
      data={carerResults}
      renderItem={({ item }) => (
        <CarerResultCard
          carerResult={item}
          handleRequest={handleRequest}
          cardButtonLabel={cardButtonLabel}
        />
      )}
      keyExtractor={(item) => item._id}
    />
  );
}

interface CarerResultCardProps {
  carerResult: CarerResult;
  handleRequest: (carerResult: CarerResult) => void;
  cardButtonLabel: string;
}

function CarerResultCard({
  carerResult,
  handleRequest,
  cardButtonLabel,
}: CarerResultCardProps) {
  const carerIcon: ImageSourcePropType = carerResult.pfp
    ? { uri: getPfpUrl(carerResult.pfp) }
    : icon;

  return (
    <Card>
      <Link
        href={{
          pathname: "/profile/[profileId]",
          params: { profileId: carerResult._id },
        }}
      >
        <Card.Content style={styles.carerResultCard}>
          <Avatar.Image source={carerIcon} />
          <CarerResultCardInfo
            carerResult={carerResult}
            handleRequest={handleRequest}
            cardButtonLabel={cardButtonLabel}
          />
        </Card.Content>
      </Link>
    </Card>
  );
}

interface CarerResultCardInfoProps {
  carerResult: CarerResult;
  handleRequest: (carerResult: CarerResult) => void;
  cardButtonLabel: string;
}

function CarerResultCardInfo({
  carerResult,
  handleRequest,
  cardButtonLabel,
}: CarerResultCardInfoProps) {
  return (
    <View>
      <Text variant="titleMedium">{carerResult.name}</Text>
      <StarRating stars={carerResult.rating ?? 0} />
      <Text variant="bodySmall">{carerResult.bio}</Text>
      <Button mode="contained" onPress={() => handleRequest(carerResult)}>
        {cardButtonLabel}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  carerResultCard: {
    flexDirection: "row",
    padding: 5,
  },
});
