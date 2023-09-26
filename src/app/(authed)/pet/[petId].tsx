import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import ReviewsView, { Review } from "../../../components/views/ReviewsView";
import axios from "axios";
import { Pet } from "../../../types/types";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import PetInfoView from "../../../components/views/PetInfoView";
import ThemedTabView from "../../../components/views/ThemedTabView";

type OwnPet = "true" | undefined;

export default function PetView() {
  const { petId, ownPet } = useLocalSearchParams<{
    petId: string;
    ownPet?: OwnPet;
  }>();
  const [pet, setPet] = useState<Pet>({
    _id: "",
    name: "Pet",
    petType: "dog",
    petSize: "small",
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const { pushError } = useMessageSnackbar();

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
        pushError("Could not fetch pet information");
      }
    })();

    return () => (ignore = true);
  }, []);

  const profileScene = () => <PetInfoView pet={pet} />;

  const reviewsScene = () => (
    <ReviewsView
      profile={pet}
      isSelf={ownPet !== undefined}
      reviews={reviews}
      isPet={true}
      updateReviews={async () => {
        setReviews(await getPetReviews());
      }}
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
