import { useRouter } from "expo-router";
import { UserType, useAuth } from "../contexts/auth";
import { useState } from "react";
import { BottomNavigation } from "react-native-paper";

const carerRoutes = [
  {
    key: "home",
    title: "Home",
    focusedIcon: "home-circle",
    unfocused: "home-circle-outline",
  },
  {
    key: "offers",
    title: "Offers",
    focusedIcon: "pencil-box-multiple",
    unfocused: "pencil-box-multiple-outline",
  },
  {
    key: "jobs",
    title: "Jobs",
    focusedIcon: "briefcase",
    unfocused: "briefcase-outline",
  },
  {
    key: "profile",
    title: "Profile",
    focusedIcon: "account",
    unfocused: "account-outline",
  },
];

const ownerRoutes = [
  {
    key: "/(owner)/home",
    title: "Home",
    focusedIcon: "home-circle",
    unfocused: "home-circle-outline",
  },
  {
    key: "/owner/requests",
    title: "Requests",
    focusedIcon: "pencil-box-multiple",
    unfocused: "pencil-box-multiple-outline",
  },
  {
    key: "/owner/search",
    title: "Find Carers",
    focusedIcon: "magnify-plus",
    unfocused: "magnify-plus-outline",
  },
  {
    key: "/owner/pets",
    title: "Pets",
    focusedIcon: "food-hot-dog",
    unfocused: "dog",
  },
  {
    key: "/(owner)/profile",
    title: "Profile",
    focusedIcon: "account",
    unfocused: "account-outline",
  },
];

export default function UserBottomNav({ userType }: { userType: UserType }) {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const { getUser } = useAuth();

  const routes = userType === "owner" ? ownerRoutes : carerRoutes;

  return (
    <BottomNavigation.Bar
      navigationState={{ index, routes }}
      onTabPress={({ route }) => {
        setIndex(routes.findIndex((r) => r.title === route.title));
        router.push(route.key);
      }}
    />
  );
}
