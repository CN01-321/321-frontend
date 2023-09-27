import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import Header from "../../../components/Header";
import { Pet } from "../../../types/types";
import EditPetForm from "../../../components/forms/EditPetForm";
import { fetchData } from "../../../utilities/fetch";

export default function EditPet() {
  const { petId } = useLocalSearchParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet>();

  useEffect(() => {
    fetchData(`/pets/${petId}`, setPet);
  }, []);

  if (!pet) return null;

  return (
    <>
      <Header title="Edit Profile" />
      <EditPetForm pet={pet} />
    </>
  );
}
