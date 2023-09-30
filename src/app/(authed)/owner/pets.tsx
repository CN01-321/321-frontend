import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import ShowModalFab from "../../../components/ShowModalFab";
import { Pet } from "../../../types/types";
import PetsView from "../../../components/views/PetsView";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import NewPetModal from "../../../components/modals/NewPetModal";
import { fetchData } from "../../../utilities/fetch";
import { useTheme } from "react-native-paper";

export default function Pets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [visible, setVisible] = useState(false);
  const { pushError } = useMessageSnackbar();
  const theme = useTheme();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const updatePets = async () => {
    await fetchData("/owners/pets", setPets, () =>
      pushError("Could not fetch pets")
    );
  };

  useEffect(() => {
    updatePets();
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header title="Pets" />
      <NewPetModal
        title="Add Pet"
        visible={visible}
        onDismiss={hideModal}
        updatePets={updatePets}
      />
      <PetsView pets={pets} ownPets />
      <ShowModalFab icon="plus" showModal={showModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
