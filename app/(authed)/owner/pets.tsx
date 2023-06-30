import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

interface Pet {
  id: string;
  name: string;
  type: string;
}

const petData: Array<Pet> = [
  {
    id: "0",
    name: "Pet 1",
    type: "Dog",
  },
  {
    id: "1",
    name: "Pet 2",
    type: "Dog",
  },
  {
    id: "2",
    name: "Pet 3",
    type: "Cat",
  },
  {
    id: "3",
    name: "Pet 4",
    type: "Cat",
  },
];

export default function Pets() {
  const [pets, setPets] = useState<Array<Pet>>([]);

  useEffect(() => {
    setPets(petData);
  }, []);

  return (
    <View>
      <Text>Pets</Text>
    </View>
  );
}
