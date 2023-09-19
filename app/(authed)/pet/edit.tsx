import { ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import Header from "../../../components/Header";
import { Pet } from "../../../types";
import EditPetForm from "../../../components/EditPetForm";
import axios from "axios";

const EditPet = () => {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet>();

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      const { data } = await axios.get(`/pets/${petId}`);
      if (!ignore) setPet(data);
    })();

    return () => (ignore = true);
  }, []);

  if (!pet) return null;

  return (
    <ScrollView>
      <Header title="Edit Profile" />
      <EditPetForm pet={pet} />
    </ScrollView>
  );
}
 
export default EditPet;