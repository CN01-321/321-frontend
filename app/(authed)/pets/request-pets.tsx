import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pet } from "../../../types";
import PetsView from "../../../components/PetsView";

const RequestPets = () => {
  const { requestId } = useLocalSearchParams<{
    requestId: string
  }>();

  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    axios
      .get(`/owners/requests/${requestId}/pets`)
      .then((response) => setPets(response.data));
  }, [])

  return (
    <View>
      { 
        pets.length > 0
        ? <PetsView pets={pets} />
        : <></>
      }
    </View>
  );
}
 
export default RequestPets;