import { useLocalSearchParams } from "expo-router";
import { Avatar, SegmentedButtons, Text } from "react-native-paper";
import { View } from "react-native";
import { useEffect, useState } from "react";
import ReviewsView, { Review } from "../../../components/ReviewsView";
import axios from "axios";
import { Pet } from "../../../types";

const icon = require("../../../assets/icon.png");

type PetViewType = "pet" | "reviews";
type OwnPet = "true" | undefined;

export default function PetView() {
  const { petId, ownPet } = useLocalSearchParams<{
    petId: string;
    ownPet?: OwnPet;
  }>();
  const [currentView, setCurrentView] = useState<PetViewType>("pet");
  const [pet, setPet] = useState<Pet>({
    name: "",
    petType: "dog",
    petSize: "small",
  });

  useEffect(() => {
    axios
      .get(`/owners/pets/${petId}`)
      .then((response) => setPet(response.data));
  }, []);

  return (
    <View>
      <SegmentedButtons
        value={currentView}
        onValueChange={(value) => setCurrentView(value as PetViewType)}
        buttons={[
          {
            value: "pet",
            icon: "dog-side",
            label: "Pet",
          },
          {
            value: "reviews",
            icon: "comment-outline",
            label: "Reviews",
          },
        ]}
      />
      {currentView === "pet" ? (
        <PetInfoView pet={pet} />
      ) : (
        // <ReviewsView
        //   profile={pet}
        //   isSelf={ownPet !== undefined}
        //   reviews={pet.reviews ?? []}
        // />
        <></>
      )}
    </View>
  );
}

function PetInfoView({ pet }: { pet: Pet }) {
  return (
    <View>
      <Avatar.Image source={icon} />
      <Text variant="titleMedium">{pet.name}</Text>
      <Text variant="bodyMedium">Pet Type: {pet.petType}</Text>
      <Text variant="bodyMedium">Pet Size: {pet.petSize}</Text>
      <Text variant="bodyMedium">
        Is Vaccinated: {pet.isVaccinated ? "Yes" : "No"}
      </Text>
      <Text variant="bodyMedium">
        Is Friendly: {pet.isFriendly ? "Yes" : "No"}
      </Text>
      <Text variant="bodyMedium">
        Is Neutered: {pet.isNeutered ? "Yes" : "No"}
      </Text>
    </View>
  );
}
