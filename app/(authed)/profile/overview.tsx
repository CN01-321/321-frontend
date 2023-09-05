import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Avatar, SegmentedButtons, Text, TextInput } from "react-native-paper";
import ReviewsView, { Review } from "../../../components/ReviewsView";
import { useAuth } from "../../../contexts/auth";
import axios from "axios";
import Header from "../../../components/Header";
import { UserType } from "../../../types";
import DynamicAvatar from "../../../components/DynamicAvatar";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";

const icon = require("../../../assets/icon.png");

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

type ProfileViewType = "profile" | "reviews";

export default function Profile() {
  const { profileId, isSelf } = useLocalSearchParams<{
    profileId: string;
    isSelf?: string;
  }>();
  const { getTokenUser } = useAuth();
  const [currentView, setCurrentView] = useState<ProfileViewType>("profile");
  const [user, setUser] = useState<User>({
    _id: "",
    name: "",
    email: getTokenUser()!.email,
    userType: getTokenUser()!.type,
    bio: "",
    phone: "",
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const { pushError } = useMessageSnackbar();

  const getProfile = async (profileId: string): Promise<User> => {
    console.log("profile id is ", profileId);
    const { data } = await axios.get<User>(`/users/${profileId}`);
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
  }, []);

  useEffect(() => {
    const updateFeedback = async () => {
      await updateReviews();
    };
    updateFeedback();
  }, [currentView]);

  return (
    <View>
      <Header
        title={user.name + (currentView === "reviews" ? " Reviews" : "")}
      />
      <SegmentedButtons
        value={currentView}
        onValueChange={(value) => {
          console.log(value);
          setCurrentView(value as ProfileViewType);
        }}
        buttons={[
          {
            value: "profile",
            icon: "account",
            label: "Profile",
          },
          {
            value: "reviews",
            icon: "comment-outline",
            label: "Reviews",
          },
        ]}
      />
      {currentView === "profile" ? (
        <ProfileInfoView user={user} />
      ) : (
        <ReviewsView
          profile={user}
          isSelf={isSelf === "true"}
          reviews={reviews}
          updateReviews={updateReviews}
        />
      )}
    </View>
  );
}

interface ProfileInfoViewProps {
  user: User;
}

function ProfileInfoView({ user }: ProfileInfoViewProps) {
  return (
    <View>
      <DynamicAvatar pfp={user.pfp} defaultPfp={icon} />
      <Text>Profile</Text>
      <TextInput
        label="Name"
        mode="outlined"
        value={user.name}
        editable={false}
      />
      <TextInput
        label="Email"
        mode="outlined"
        value={user.email}
        editable={false}
      />
      <TextInput
        label="Phone"
        mode="outlined"
        value={user.phone}
        editable={false}
      />
    </View>
  );
}
