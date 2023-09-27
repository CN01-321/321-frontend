import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import ReviewsView, { Review } from "../../../components/views/ReviewsView";
import { Pet } from "../../../types/types";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import PetInfoView from "../../../components/views/PetInfoView";
import ThemedTabView from "../../../components/views/ThemedTabView";
import { fetchData } from "../../../utilities/fetch";

export default function PetProfile() {
  const { petId, ownPet } = useLocalSearchParams<{
    petId: string;
    ownPet?: "true" | undefined;
  }>();
  const [pet, setPet] = useState<Pet>({
    _id: "",
    name: "Pet",
    petType: "dog",
    petSize: "small",
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const { pushError } = useMessageSnackbar();

  const updatePetInfo = async () => {
    await fetchData(`/pets/${petId}/`, setPet, () =>
      pushError("Could not fetch pet profile")
    );

    await fetchData(`/pets/${petId}/feedback`, setReviews, () =>
      pushError("Could not fetch pet reviews")
    );
  };

  useEffect(() => {
    updatePetInfo();
  }, []);

  const profileScene = () => <PetInfoView pet={pet} />;

  const reviewsScene = () => (
    <ReviewsView
      profile={pet}
      isSelf={ownPet !== undefined}
      reviews={reviews}
      isPet={true}
      updateReviews={updatePetInfo}
    />
  );

  const scenes = [
    { key: "first", title: "Profile", scene: profileScene },
    { key: "second", title: "Reviews", scene: reviewsScene },
  ];

  return (
    <>
      <Header title={pet.name} />
      <ThemedTabView scenes={scenes} />
    </>
  );
}
