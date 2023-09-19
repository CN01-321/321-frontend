import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import ShowModalFab from "../../../components/ShowModalFab";
import axios from "axios";
import { Pet } from "../../../types/types";
import PetsView from "../../../components/PetsView";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import NewPetModal from "../../../components/modals/NewPetModal";

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [visible, setVisible] = useState(false);
  const { pushError } = useMessageSnackbar();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const updatePets = async () => {
    try {
      const { data } = await axios.get<Pet[]>("/owners/pets");
      setPets(data);
    } catch (e) {
      console.error(e);
      pushError("Could not fetch pets");
    }
  };

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      if (!ignore) await updatePets();
    })();

    return () => (ignore = true);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Pets" />
      {/* <AddPetModal visible={visible} onDismiss={hideModal} /> */}
      <NewPetModal
        title="Add Pet"
        visible={visible}
        onDismiss={hideModal}
        updatePets={updatePets}
      />
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
