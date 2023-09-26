import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import ReviewsView, { Review } from "../../../components/views/ReviewsView";
import axios from "axios";
import { OwnerProfile, CarerProfile } from "../../../types/types";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import Header from "../../../components/Header";
import ThemedTabView from "../../../components/views/ThemedTabView";
import OwnerProfileInfoView from "../../../components/views/OwnerProfileInfoView";
import CarerProfileInfoView from "../../../components/views/CarerProfileInfoView";

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

  const getProfile = async (
    profileId: string
  ): Promise<OwnerProfile | CarerProfile> => {
    console.log("profile id is ", profileId);
    const { data } = await axios.get(`/users/${profileId}`);
    console.log("user is ", data);
    return data;
  };

  const getUserReviews = async (profileId: string): Promise<Review[]> => {
    console.log(profileId);
    const { data } = await axios.get<Array<Review>>(
      `/users/${profileId}/feedback`
    );

    return data;
  };

  const updateReviews = async () => {
    setReviews(await getUserReviews(profileId!));
  };

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      // get both profile info and reviews at the same time
      try {
        const [user, reviews] = await Promise.all([
          getProfile(profileId!),
          getUserReviews(profileId!),
        ]);

        console.log(user, reviews);
        if (!ignore) {
          setUser(user);
          setReviews(reviews);
        }
      } catch (e) {
        console.error(e);
        pushError("Could not fetch user data");
      }
    })();

    return () => (ignore = true);
  }, [profileId]);

  if (!user) return null;

  const profileRoute = () =>
    isOwner(user) ? (
      <OwnerProfileInfoView owner={user} />
    ) : (
      <CarerProfileInfoView carer={user} />
    );

  const reviewsRoute = () => (
    <ReviewsView
      profile={user}
      isSelf={isSelf === "true"}
      reviews={reviews}
      updateReviews={updateReviews}
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
