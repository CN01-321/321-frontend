import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Modal,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";
import { StarRating } from "../../components/StarRating";
import ShowModalFab from "../../components/ShowModalFab";
import ReviewsView, { Review } from "../../components/ReviewsView";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  pfp?: string;
  reviews: Array<Review>;
}

const userData: User = {
  id: "0",
  name: "Firstname Lastname",
  email: "email@email.com",
  phone: "0412345678",
  reviews: [
    {
      reviewId: "0",
      reviewerId: "0",
      reviewerIcon: "iconPath",
      reviewerName: "Reviewer 1",
      date: new Date(),
      message: "nice pets",
      image: "imagePath",
      likes: 0,
      comments: [],
    },
    {
      reviewId: "1",
      reviewerId: "1",
      reviewerName: "Reviewer 2",
      date: new Date(),
      rating: 2,
      message: "bad pets",
      likes: 5,
      comments: [
        {
          commentId: "0",
          commenterId: "0",
          commenterName: "Commenter 1",
          date: new Date(),
          message: "hot take",
          comments: [],
        },
        {
          commentId: "1",
          commenterId: "1",
          commenterName: "Commenter 2",
          date: new Date(),
          message: "i agree",
          comments: [],
        },
      ],
    },
  ],
};

type ProfileViewType = "profile" | "reviews";

export default function Profile() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  // TODO update this to true if the user
  const [isSelf, setIsSelf] = useState(false);
  const [currentView, setCurrentView] = useState<ProfileViewType>("profile");
  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    phone: "",
    reviews: [],
  });
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      setIsSelf(false);
    }
    setUser(userData);
  }, []);

  return (
    <View>
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
        <ReviewsView profile={user} isSelf={isSelf} reviews={user.reviews} />
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
      {user.pfp ? (
        // TODO replace this with actual profile picture
        <Avatar.Icon icon="account-circle" size={100} />
      ) : (
        <Avatar.Icon icon="account-circle" size={100} />
      )}
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
