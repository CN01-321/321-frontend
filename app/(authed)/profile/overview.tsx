import { useLocalSearchParams } from "expo-router";
import { ReactNode, useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import ReviewsView, { Review } from "../../../components/ReviewsView";
import { useAuth } from "../../../contexts/auth";
import axios from "axios";
import { UserType } from "../../../types/types";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import UserProfileInfoView from "../../../components/UserProfileInfoView";
import { SceneMap, TabView, TabBar } from "react-native-tab-view";
import { useTheme } from "react-native-paper";
import Header from "../../../components/Header";

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

const renderTabBar = (props: any): ReactNode => {
  const theme = useTheme();

  return (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{ elevation:0, backgroundColor: "#FCFCFC" }}
      labelStyle={{ 
        color: "#1D1B20",
        fontFamily: "Montserrat-Medium"
      }}
    /> 
  );
}

export default function Profile() {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const { profileId, isSelf } = useLocalSearchParams<{
    profileId: string;
    isSelf?: string;
  }>();
  const { getTokenUser } = useAuth();
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
  }, [profileId]);

  useEffect(() => {
    const updateFeedback = async () => {
      await updateReviews();
    };
    updateFeedback();
  }, [index]);

  const FirstRoute = () => (
    <UserProfileInfoView user={user} />
  );

  const SecondRoute = () => (
    <ReviewsView
      profile={user}
      isSelf={isSelf === "true"}
      reviews={reviews}
      updateReviews={updateReviews}
    />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const [routes] = useState([
    { key: 'first', title: 'Profile' },
    { key: 'second', title: 'Reviews' },
  ]);

  return (
    <>
      <Header title={user.name} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </>
  );
}