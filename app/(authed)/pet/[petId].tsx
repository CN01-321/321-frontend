import { useLocalSearchParams } from "expo-router";
import { Pet } from "../owner/pets";
import { Avatar, SegmentedButtons, Text } from "react-native-paper";
import { View } from "react-native";
import { useEffect, useState } from "react";
import ReviewsView, { Review } from "../../../components/ReviewsView";
import axios from "axios";

const icon = require("../../../assets/icon.png");

// const petData: Pet = {
//   id: "0",
//   name: "Pet 1",
//   type: "dog",
//   size: "medium",
//   icon: "icon",
//   reviews: [
//     {
//       reviewId: "0",
//       reviewerId: "0",
//       reviewerIcon: "iconPath",
//       reviewerName: "Reviewer 1",
//       date: new Date(),
//       rating: 5,
//       message: "good boy",
//       image: "imagePath",
//       likes: 0,
//       comments: [],
//     },
//     {
//       reviewId: "1",
//       reviewerId: "1",
//       reviewerName: "Reviewer 2",
//       date: new Date(),
//       rating: 2,
//       message: "bad dog",
//       likes: 5,
//       comments: [
//         {
//           commentId: "0",
//           commenterId: "0",
//           commenterName: "Commenter 1",
//           date: new Date(),
//           message: "hot take",
//           comments: [],
//         },
//         {
//           commentId: "1",
//           commenterId: "1",
//           commenterName: "Commenter 2",
//           date: new Date(),
//           message: "i agree",
//           comments: [],
//         },
//       ],
//     },
//   ],
// };

type PetViewType = "pet" | "reviews";
type OwnPet = "true" | undefined;

export default function PetView() {
  const { petId, ownPet } = useLocalSearchParams<{
    petId: string;
    ownPet?: OwnPet;
  }>();
  const [currentView, setCurrentView] = useState<PetViewType>("pet");
  const [pet, setPet] = useState<Pet>({});

  useEffect(() => {
    axios.get(`/owners/pets/${petId}`).then(response => setPet(response.data));
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
      <Text variant="bodyMedium">Is Vaccinated: {pet.isVaccinated ? "Yes" : "No"}</Text>
      <Text variant="bodyMedium">Is Friendly: {pet.isFriendly ? "Yes" : "No"}</Text>
      <Text variant="bodyMedium">Is Neutered: {pet.isNeutered ? "Yes" : "No"}</Text>
    </View>
  );
}
