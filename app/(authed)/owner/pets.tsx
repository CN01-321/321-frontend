import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Pressable } from "react-native";
import { Card, FAB, Text } from "react-native-paper";
import { Review } from "../../../components/ReviewsView";
import AddPetModal from "../../../components/AddPetModal";
import { Stack } from "expo-router";
import axios from "axios";
import { Pet } from "../../../types";

const icon = require("../../../assets/icon.png");

// const petData: Array<Pet> = [
//   {
//     id: "0",
//     name: "Pet 1",
//     type: "dog",
//     size: "medium",
//     icon: "icon",
//   },
//   {
//     id: "1",
//     name: "Pet 2",
//     type: "dog",
//     size: "medium",
//   },
//   {
//     id: "2",
//     name: "Pet 3",
//     type: "cat",
//     size: "medium",
//     icon: "icon",
//   },
//   {
//     id: "3",
//     name: "Pet 4",
//     type: "cat",
//     size: "medium",
//   },
// ];

export default function Pets() {
  const [pets, setPets] = useState<Array<Pet>>([]);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    axios.get("/owners/pets").then((response) => setPets(response.data));
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Pets",
        }}
      />
      <AddPetModal visible={visible} onDismiss={hideModal} />
      <ScrollView contentContainerStyle={styles.petsArea}>
        {pets.map((p) => (
          <PetCard key={p._id} pet={p} />
        ))}
        <FAB icon="plus" label="Add Pet" onPress={showModal} />
      </ScrollView>
    </View>
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

function AddPetFAB() {
  return <FAB icon="plus" label="Add Pet" />;
}

const styles = StyleSheet.create({
  container: {},
  petsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  petCard: {
    // flex: 3,
    width: "40%",
    margin: 10,
  },
  petCardImg: {},
});
