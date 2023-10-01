import { Slot } from "expo-router";
import { PetsContextProvider } from "../../../contexts/pets";
import { RequestContextProvider } from "../../../contexts/requests";

export default function OwnerLayout() {
  return (
    <PetsContextProvider>
      <RequestContextProvider>
        <Slot />
      </RequestContextProvider>
    </PetsContextProvider>
  );
}
