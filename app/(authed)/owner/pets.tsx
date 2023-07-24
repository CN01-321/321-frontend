import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Card, FAB, Text } from "react-native-paper";
import AddPetModal from "../../../components/AddPetModal";
import ShowModalFab from "../../../components/ShowModalFab";
import { Stack } from "expo-router";
import axios from "axios";
import { Pet } from "../../../types";
import Header from "../../../components/Header";

const icon = require("../../../assets/icon.png");

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
      <Header title="Pets" />
      <AddPetModal visible={visible} onDismiss={hideModal} />
      <ScrollView contentContainerStyle={styles.petsArea}>
        {pets.map((p) => (
          <View key={p._id} style={styles.petCardContainer}>
            <PetCard pet={p} />
          </View>
        ))}
      </ScrollView>
      <ShowModalFab icon="plus" showModal={showModal} />
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
