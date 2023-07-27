import { useLocalSearchParams } from "expo-router";
import { Avatar, SegmentedButtons, Text } from "react-native-paper";
import { View } from "react-native";
import { useEffect, useState } from "react";
import ReviewsView, { Review } from "../../../components/ReviewsView";
import axios from "axios";
import { Pet } from "../../../types";
import Header from "../../../components/Header";

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
  const [reviews, setReviews] = useState<Array<Review>>([]);

  const getPetProfile = async (): Promise<Pet> => {
    const { data } = await axios.get<Pet>(`/owners/pets/${petId}`);
    return data;
  };

  const getPetReviews = async (): Promise<Array<Review>> => {
    const { data } = await axios.get<Array<Review>>(`/pets/${petId}/feedback`);

    console.log(data);
    // map all date strings to dates
    const reviews = data.map((r) => {
      return {
        ...r,
        postedOn: new Date(r.postedOn),
        comments: r.comments.map((c) => {
          return {
            ...c,
            postedOn: new Date(c.postedOn),
          };
        }),
      };
    });

    return reviews;
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const [pet, reviews] = await Promise.all([
          getPetProfile(),
          getPetReviews(),
        ]);
        setPet(pet);
        setReviews(reviews);
      } catch (e) {
        console.error(e);
      }
    })();
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
        />
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
