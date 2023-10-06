import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import ReviewsView from "../../../components/views/ReviewsView";
import { OwnerProfile, CarerProfile } from "../../../types/types";
import Header from "../../../components/Header";
import ThemedTabView from "../../../components/views/ThemedTabView";
import OwnerProfileInfoView from "../../../components/views/OwnerProfileInfoView";
import CarerProfileInfoView from "../../../components/views/CarerProfileInfoView";
import { useProfile } from "../../../contexts/profile";

function isOwner(user: OwnerProfile | CarerProfile): user is OwnerProfile {
  return user.userType === "owner";
}

export default function Profile() {
  const { profileId, isSelf } = useLocalSearchParams<{
    profileId: string;
    isSelf?: string;
  }>();
  const { fetchProfile, getUserProfile, getReviews } = useProfile();

  useEffect(() => {
    fetchProfile(profileId ?? "", "user");
  }, [profileId]);

  const user = getUserProfile();

  if (!user) return null;

  const self = isSelf === "true";

  const profileRoute = () =>
    isOwner(user) ? (
      <OwnerProfileInfoView owner={user} isSelf={self} />
    ) : (
      <CarerProfileInfoView carer={user} isSelf={self} />
    );

  const reviewsRoute = () => (
    <ReviewsView isSelf={isSelf === "true"} reviews={getReviews()} />
  );

  const scenes = [
    { key: "first", title: "Profile", scene: profileRoute },
    { key: "second", title: "Reviews", scene: reviewsRoute },
  ];

  return (
    <>
      <Header title={user.name} showLogo={true} showButtons={true} />
      <ThemedTabView scenes={scenes} />
    </>
  );
}
