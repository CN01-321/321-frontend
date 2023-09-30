import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import ReviewsView, { Review } from "../../../components/views/ReviewsView";
import { OwnerProfile, CarerProfile } from "../../../types/types";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import Header from "../../../components/Header";
import ThemedTabView from "../../../components/views/ThemedTabView";
import OwnerProfileInfoView from "../../../components/views/OwnerProfileInfoView";
import CarerProfileInfoView from "../../../components/views/CarerProfileInfoView";
import { fetchData } from "../../../utilities/fetch";

function isOwner(user: OwnerProfile | CarerProfile): user is OwnerProfile {
  return user.userType === "owner";
}

export default function Profile() {
  const { profileId, isSelf } = useLocalSearchParams<{
    profileId: string;
    isSelf?: string;
  }>();
  const [user, setUser] = useState<OwnerProfile | CarerProfile>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const { pushError } = useMessageSnackbar();

  const updateProfile = async () => {
    await fetchData(`/users/${profileId}`, setUser, () =>
      pushError("Could not fetch user profile")
    );
    await fetchData(`/users/${profileId}/feedback`, setReviews, () =>
      pushError("Could not fetch user reviews")
    );
  };

  useEffect(() => {
    updateProfile();
  }, [profileId]);

  if (!user) return null;

  const self = isSelf === "true";

  const profileRoute = () =>
    isOwner(user) ? (
      <OwnerProfileInfoView owner={user} isSelf={self} />
    ) : (
      <CarerProfileInfoView carer={user} isSelf={self} />
    );

  const reviewsRoute = () => (
    <ReviewsView
      profile={user}
      isSelf={isSelf === "true"}
      reviews={reviews}
      updateReviews={updateProfile}
    />
  );

  const scenes = [
    { key: "first", title: "Profile", scene: profileRoute },
    { key: "second", title: "Reviews", scene: reviewsRoute },
  ];

  return (
    <>
      <Header title={user.name} />
      <ThemedTabView scenes={scenes} />
    </>
  );
}
