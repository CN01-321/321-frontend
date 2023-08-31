import { useLocalSearchParams } from "expo-router";
import { SegmentedButtons, Text } from "react-native-paper";
import { View } from "react-native";
import { useEffect, useState } from "react";
import ReviewsView, { Review } from "../../../components/ReviewsView";
import axios from "axios";
import { Pet } from "../../../types";
import Header from "../../../components/Header";
import DynamicAvatar from "../../../components/DynamicAvatar";

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
    _id: "",
    name: "Pet",
    petType: "dog",
    petSize: "small",
  });
  const [reviews, setReviews] = useState<Review[]>([]);

  const getPetProfile = async (): Promise<Pet> => {
    const { data } = await axios.get<Pet>(`/pets/${petId}`);
    return data;
  };

  const getPetReviews = async (): Promise<Review[]> => {
    const { data } = await axios.get<Review[]>(`/pets/${petId}/feedback`);
    return data;
  };

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const [pet, reviews] = await Promise.all([
          getPetProfile(),
          getPetReviews(),
        ]);

        if (!ignore) {
          setPet(pet);
          setReviews(reviews);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => (ignore = true);
  }, []);

  return (
    <View>
      <Header
        title={pet.name + (currentView === "reviews" ? " Reviews" : "")}
      />
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
        <ReviewsView
          profile={pet}
          isSelf={ownPet !== undefined}
          reviews={reviews}
          isPet={true}
          updateReviews={async () => {
            setReviews(await getPetReviews());
          }}
        />
      )}
    </View>
  );
}

function PetInfoView({ pet }: { pet: Pet }) {
  return (
    <View>
      <DynamicAvatar pfp={pet.pfp} defaultPfp={icon} />
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
