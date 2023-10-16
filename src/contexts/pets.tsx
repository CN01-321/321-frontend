/**
 * @file Context for owner's pets
 * @author George Bull
 */

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Pet } from "../types/types";
import { fetchData } from "../utilities/fetch";
import { useMessageSnackbar } from "./messageSnackbar";
import axios from "axios";
import { ImagePickerAsset } from "expo-image-picker";
import { uploadImage } from "../utilities/image";

type NewPet = Omit<Pet, "_id">;

interface PetsContextType {
  getPets: () => Pet[];
  newPet: (pet: NewPet, pfp?: ImagePickerAsset) => Promise<void>;
}

const PetsContext = createContext<PetsContextType>({
  getPets: () => {
    throw new Error("Pets context not initialised");
  },
  newPet: () => {
    throw new Error("Pets context not initialised");
  },
});

export function usePets() {
  return useContext(PetsContext);
}

export function PetsContextProvider({ children }: PropsWithChildren) {
  const [pets, setPets] = useState<Pet[]>([]);
  const { pushMessage, pushError } = useMessageSnackbar();

  const fetchPets = async () => {
    await fetchData("/owners/pets", setPets, () =>
      pushError("Could not fetch pets")
    );
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const getPets = () => pets;

  const newPet = async (pet: NewPet, pfp?: ImagePickerAsset) => {
    const { data } = await axios.post<{ _id: string }>("/owners/pets", pet);
    const petId = data;

    if (pfp) {
      try {
        await uploadImage(`/owners/pets/${petId}/pfp`, pfp);
      } catch (err) {
        if (err instanceof Error) pushError(err.message);
      }
    }

    pushMessage("Successfully added new pet!");
    await fetchPets();
  };

  return (
    <PetsContext.Provider value={{ getPets, newPet }}>
      {children}
    </PetsContext.Provider>
  );
}
