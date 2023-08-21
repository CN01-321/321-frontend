import { Stack, useRouter, useSegments } from "expo-router";
import { useAuth } from "../../contexts/auth";
import { useEffect, useState } from "react";
import { BottomNavigation, IconButton } from "react-native-paper";
import { View } from "react-native";
import { Href } from "expo-router/build/link/href";

export interface Route {
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon: string;
}

const carerRoutes = [
  {
    key: "home",
    title: "Home",
    focusedIcon: "home-circle",
    unfocusedIcon: "home-circle-outline",
  },
  {
    key: "carer/offers",
    title: "Offers",
    focusedIcon: "pencil-box-multiple",
    unfocusedIcon: "pencil-box-multiple-outline",
  },
  {
    key: "carer/jobs",
    title: "Jobs",
    focusedIcon: "briefcase",
    unfocusedIcon: "briefcase-outline",
  },
  {
    key: "profile",
    title: "Profile",
    focusedIcon: "account",
    unfocusedIcon: "account-outline",
  },
];

const ownerRoutes = [
  {
    key: "home",
    title: "Home",
    focusedIcon: "home-circle",
    unfocusedIcon: "home-circle-outline",
  },
  {
    key: "owner/requests",
    title: "Requests",
    focusedIcon: "pencil-box-multiple",
    unfocusedIcon: "pencil-box-multiple-outline",
  },
  {
    key: "owner/search",
    title: "Find Carers",
    focusedIcon: "magnify-plus",
    unfocusedIcon: "magnify-plus-outline",
  },
  {
    key: "owner/pets",
    title: "Pets",
    focusedIcon: "food-hot-dog",
    unfocusedIcon: "dog",
  },
  {
    key: "profile",
    title: "Profile",
    focusedIcon: "account",
    unfocusedIcon: "account-outline",
  },
];

export default function UserLayout() {
  const { getTokenUser } = useAuth();
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const segments = useSegments();

  const routes = getTokenUser()?.type === "owner" ? ownerRoutes : carerRoutes;

  useEffect(() => {
    const path = segments.filter((s) => s.match(/\(/) === null).join("/");
    console.log(path);
    setIndex(routes.findIndex((r) => r.key === path));
  }, [segments]);

  const notificationButton = () => <IconButton icon="bell" />;

  return (
    <>
      <Stack />
      <UserBottomNav
        routes={routes}
        index={index}
        onChange={(route: Route) => {
          setIndex(routes.findIndex((r) => r.key === route.key));

          let href: Href =
            route.key === "profile"
              ? {
                  pathname: `/profile/[profileId]`,
                  params: { profileId: getTokenUser()?._id, isSelf: "true" },
                }
              : route.key;

          router.push(href);
        }}
      />
    </>
  );
}

interface UserBottomNavProps {
  routes: Route[];
  index: number;
  onChange: (route: Route) => void;
}

function UserBottomNav({ routes, index, onChange }: UserBottomNavProps) {
  return (
    <BottomNavigation.Bar
      navigationState={{ index, routes }}
      onTabPress={({ route }) => onChange(route)}
    />
  );
}
