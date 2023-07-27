import { FlatList, View, StyleSheet } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { StarRating } from "./StarRating";
import { Link } from "expo-router";

const icon = require("../assets/icon.png");

export interface CarerResult {
  _id: string;
  name: string;
  rating?: number;
  bio?: string;
  icon?: string;
}

interface CarerResultsViewProps {
  carerResults: Array<CarerResult>;
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
  return (
    <Card>
      <Link
        href={{
          pathname: "/profile/[profileId]",
          params: { profileId: carerResult._id },
        }}
      >
        <Card.Content style={styles.carerResultCard}>
          <Avatar.Image source={icon} />
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
