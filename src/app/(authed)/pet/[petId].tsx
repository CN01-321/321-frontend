import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import ReviewsView from "../../../components/views/ReviewsView";
import Header from "../../../components/Header";
import PetInfoView from "../../../components/views/PetInfoView";
import ThemedTabView from "../../../components/views/ThemedTabView";
import { useProfile } from "../../../contexts/profile";

export default function PetProfile() {
  const { petId, ownPet } = useLocalSearchParams<{
    petId: string;
    ownPet?: "true" | undefined;
  }>();
  const { fetchProfile, getPetProfile, getReviews } = useProfile();

  useEffect(() => {
    fetchProfile(petId ?? "", "pet");
  }, [petId]);

  const pet = getPetProfile();

  if (!pet) return null;

  const profileScene = () => (
    <PetInfoView pet={pet} ownPet={ownPet === "true"} />
  );

  const reviewsScene = () => (
    <ReviewsView isSelf={ownPet === "true"} reviews={getReviews()} />
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
