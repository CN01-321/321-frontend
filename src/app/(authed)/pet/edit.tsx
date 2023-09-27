import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import Header from "../../../components/Header";
import { Pet } from "../../../types/types";
import EditPetForm from "../../../components/forms/EditPetForm";
import { fetchData } from "../../../utilities/fetch";
import { ScrollView } from "react-native";

export default function EditPet() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet>();

  const getPet = async () => await fetchData(`/pets/${petId}`, setPet);

  useEffect(() => {
    getPet();
  }, []);

  if (!pet) return null;

  return (
    <>
      <Header title="Edit Profile" />
      <ScrollView>
        <EditPetForm pet={pet} />
      </ScrollView>
    </>
  );
}
