import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import AddPetModal from "../../../components/AddPetModal";
import ShowModalFab from "../../../components/ShowModalFab";
import axios from "axios";
import { Pet } from "../../../types";
import PetsView from "../../../components/PetsView";
import Header from "../../../components/Header";
import DynamicCardCover from "../../../components/DynamicCardCover";

const icon = require("../../../assets/icon.png");

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      const { data } = await axios.get<Pet[]>("/owners/pets");

      console.log("pets are: ", data);

      if (!ignore) setPets(data);
    })();

    return () => (ignore = true);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Pets" />
      <AddPetModal visible={visible} onDismiss={hideModal} />
      <PetsView pets={pets} />
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
      <DynamicCardCover imageId={pet.pfp} defaultImage={icon} />
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
  petCardImg: { width: 300, height: 300 },
});
