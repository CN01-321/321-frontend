import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

const icon = require("../../assets/icon.png");

interface Respondent {
  id: string,
  name: string,
  rating: number,
  message: string
  price: number
  icon: string,
}

const respondentData: Array<Respondent> = [
  {
    id: "0",
    name: "Carer 1",
    rating: 4,
    message: "I am an enthusiastic pet carer",
    price: 20,
    icon: "../../assets/icon.png"
  },
  {
    id: "1",
    name: "Carer 2",
    rating: 2,
    message: "I am an enthusiastic pet carer",
    price: 30,
    icon: "../../assets/icon.png"
  },
  {
    id: "2",
    name: "Carer 3",
    rating: 5,
    message: "I am an enthusiastic pet carer",
    price: 15,
    icon: "../../assets/icon.png"
  },
];

export default function Respondents() {
  const {requestId} = useLocalSearchParams<{requestId: string}>();
  const [respondents, setRespondents] = useState<Array<Respondent>>([]);

  
  
  return (
    <View>
      <Text>Respondents {requestId}</Text>
    </View>
  );
}
