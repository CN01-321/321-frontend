import { Slot } from "expo-router";
import { OffersContextProvider } from "../../../contexts/offers";

export default function CarerLayout() {
  return (
    <OffersContextProvider>
      <Slot />
    </OffersContextProvider>
  );
}
