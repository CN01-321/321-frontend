import { View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pet } from "../../../types/types";
import PetsView from "../../../components/views/PetsView";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";

const RequestPets = () => {
  const { requestId } = useLocalSearchParams<{
    requestId: string;
  }>();
  const [pets, setPets] = useState<Pet[]>([]);
  const { pushError } = useMessageSnackbar();

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<Pet[]>(
          `/owners/requests/${requestId}/pets`
        );

        if (!ignore) setPets(data);
      } catch (e) {
        console.error(e);
        pushError("Could not fetch pet");
      }
    })();

    return () => (ignore = true);
  }, []);

  return (
    <View>
      <Stack.Screen
        options={{
          headerTitle: "Pets in Request",
        }}
      />
      <View>{pets.length > 0 ? <PetsView pets={pets} /> : <></>}</View>
    </View>
  );
};

export default RequestPets;
