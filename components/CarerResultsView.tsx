import { useEffect } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Avatar, Button, Card, Text } from "react-native-paper";

const icon = require("../assets/icon.png");

export interface CarerResult {
  id: string;
  name: string;
  rating: number;
  message: string;
  icon: string;
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
      keyExtractor={(item) => item.id}
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
      <Card.Content style={styles.carerResultCard}>
        <Avatar.Image source={icon} />
        <CarerResultCardInfo
          carerResult={carerResult}
          handleRequest={handleRequest}
          cardButtonLabel={cardButtonLabel}
        />
      </Card.Content>
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
      <StarRating stars={carerResult.rating} />
      <Text variant="bodySmall">{carerResult.message}</Text>
      <Button mode="contained" onPress={() => handleRequest(carerResult)}>
        {cardButtonLabel}
      </Button>
    </View>
  );
}

// not sure how else to do this
function StarRating({ stars }: { stars: number }) {
  const star = <Avatar.Icon icon={"star"} size={20} />;

  return (
    <View style={styles.starRating}>
      {stars > 0 && star}
      {stars > 1 && star}
      {stars > 2 && star}
      {stars > 3 && star}
      {stars > 4 && star}
    </View>
  );
}

const styles = StyleSheet.create({
  carerResultCard: {
    flexDirection: "row",
    padding: 5,
  },
  starRating: {
    flexDirection: "row",
  },
});
