import { useRouter } from "expo-router";
import { useState } from "react";
import { BottomNavigation } from "react-native-paper";

export default function OwnerBottomNav() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
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
  ]);

  const router = useRouter();

  return (
    <BottomNavigation.Bar
      navigationState={{ index, routes }}
      onTabPress={({ route }) => {
        setIndex(routes.findIndex(r => r.title === route.title));
        router.push(route.key);
      }}
    />
  );
}
