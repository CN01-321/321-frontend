import { ScrollView, View, StyleSheet } from "react-native";
import { Pet } from "../types";
import { useRouter } from "expo-router";
import { Card, Text } from "react-native-paper";

const icon = require("../assets/icon.png");

type PetsViewProp = {
  pets: Pet[];
}

const PetsView = ({ pets }: PetsViewProp) => {
  return (
    <ScrollView contentContainerStyle={styles.petsArea}>
      {pets.map((p) => (
        <View key={p._id} style={styles.petCardContainer}>
          <PetCard pet={p} />
        </View>
      ))}
    </ScrollView>
  );
}

function PetCard({ pet }: { pet: Pet }) {
  const router = useRouter();

  return (
    <Card
      style={styles.petCard}
      onPress={() =>
        router.push({
          pathname: `pet/${pet._id}`,
          params: { ownPet: "true", petDetails: pet },
        })
      }
    >
      <Card.Cover source={icon} style={styles.petCardImg} />
      <Card.Content>
        <Text variant="titleSmall">{pet.name}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  petsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  petCard: {
    width: "90%",
    margin: "2.5%",
  },
  petCardContainer: {
    width: "50%",
    display: "flex",
  },
  petCardImg: {},
});
 
export default PetsView;