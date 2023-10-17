import { useState } from "react";
import { View, StyleSheet } from "react-native";
import ShowModalFab from "../../../components/ShowModalFab";
import PetsView from "../../../components/views/PetsView";
import Header from "../../../components/Header";
import NewPetModal from "../../../components/modals/NewPetModal";
import { useTheme } from "react-native-paper";
import { usePets } from "../../../contexts/pets";

export default function Pets() {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const { getPets } = usePets();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <>
      <Header showLogo showButtons title="Pets" />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <NewPetModal title="Add Pet" visible={visible} onDismiss={hideModal} />
        <PetsView pets={getPets()} ownPets />
        <ShowModalFab icon="plus" showModal={showModal} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
