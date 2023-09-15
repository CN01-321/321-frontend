import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import AddPetModal from "../../../components/AddPetModal";
import ShowModalFab from "../../../components/ShowModalFab";
import axios from "axios";
import { Pet } from "../../../types";
import PetsView from "../../../components/PetsView";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [visible, setVisible] = useState(false);
  const { pushError } = useMessageSnackbar();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<Pet[]>("/owners/pets");
        if (!ignore) setPets(data);
      } catch (e) {
        console.error(e);
        pushError("Could not fetch pets");
      }
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
