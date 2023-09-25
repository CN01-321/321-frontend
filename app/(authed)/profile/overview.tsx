import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import ReviewsView, { Review } from "../../../components/ReviewsView";
import axios from "axios";
import { Owner, Carer } from "../../../types/types";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import UserProfileInfoView from "../../../components/UserProfileInfoView";
import Header from "../../../components/Header";
import ThemedTabView from "../../../components/ThemedTabView";

interface User {
  _id: string;
  name: string;
  email: string;
  userType: UserType;
  bio: string;
  phone: string;
  preferredTravelDistance?: number;
  hourlyRate?: number;
  pfp?: string;
}

export default function Profile() {
  const layout = useWindowDimensions();
  const { profileId, isSelf } = useLocalSearchParams<{
    profileId: string;
    isSelf?: string;
  }>();
  const [user, setUser] = useState<Owner | Carer>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const { pushError } = useMessageSnackbar();

  const getProfile = async (profileId: string): Promise<Owner | Carer> => {
    console.log("profile id is ", profileId);
    const { data } = await axios.get(`/users/${profileId}`);
    console.log("user is ", data);
    return data;
  };

  const getUserReviews = async (profileId: string): Promise<Array<Review>> => {
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

  const profileRoute = () => <UserProfileInfoView user={user} />;

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
