/**
 * @file Route for viewing pets for a request
 * @author Matthew Kolega
 */

import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pet } from "../../../types/types";
import PetsView from "../../../components/views/PetsView";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import Header from "../../../components/Header";
import { fetchData } from "../../../utilities/fetch";

const RequestPets = () => {
  const { requestId } = useLocalSearchParams<{
    requestId: string;
  }>();
  const [pets, setPets] = useState<Pet[]>([]);
  const { pushError } = useMessageSnackbar();

  useEffect(() => {
    fetchData(`owners/requests/${requestId}/pets`, setPets, () =>
      pushError("Could not fetch pet")
    );
  }, [requestId]);

  return (
    <View>
      <Header title="Pets in Request" />
      <View>
        {pets.length > 0 ? <PetsView pets={pets} ownPets={false} /> : <></>}
      </View>
    </View>
  );
};

export default RequestPets;
