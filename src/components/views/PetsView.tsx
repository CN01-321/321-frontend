/**
 * @file Component for pet profile cards for an owner or request
 * @author George Bull
 * @author Matthew Kolega
 */

import { FlatList, StyleSheet, View } from "react-native";
import { Pet, petSelectorTypes } from "../../types/types";
import { useRouter } from "expo-router";
import { Card, Text } from "react-native-paper";
import DynamicCardCover from "../DynamicCardCover";

type PetsViewProp = {
  pets: Pet[];
  ownPets: boolean;
};

const PetsView = ({ pets, ownPets }: PetsViewProp) => {
  return (
    <View style={styles.view}>
      <FlatList
        data={pets}
        renderItem={({ item }) => <PetCard pet={item} ownPet={ownPets} />}
        numColumns={2}
        contentContainerStyle={styles.container}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

interface PetCardProps {
  pet: Pet;
  ownPet: boolean;
}

function PetCard({ pet, ownPet }: PetCardProps) {
  const router = useRouter();

  const petType = petSelectorTypes.find(
    (petType) => petType.key == pet.petType
  )?.name;

  return (
    <Card
      style={styles.petCard}
      onPress={() =>
        router.push({
          pathname: `pet/${pet._id}`,
          params: { ownPet: ownPet ? "true" : "false", petDetails: pet },
        })
      }
    >
      <DynamicCardCover
        imageId={pet.pfp}
        defaultImage={pet.petType}
        style={styles.petCardImg}
      />
      <Card.Content>
        <Text variant="titleMedium">{pet.name}</Text>
        <Text variant="bodyMedium">{petType}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  view: {
    width: "100%",
  },
  container: {
    marginLeft: "4%",
    marginRight: "4%",
  },
  petCard: {
    margin: "2%",
    overflow: "hidden",
  },
  petCardImg: {
    width: 175,
    height: 175,
  },
});

export default PetsView;
