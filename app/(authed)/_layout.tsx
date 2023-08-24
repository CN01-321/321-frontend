import { Stack, useRouter, useSegments } from "expo-router";
import { useAuth } from "../../contexts/auth";
import { useEffect, useState } from "react";
import { Text, BottomNavigation, IconButton } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Href } from "expo-router/build/link/href";
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";

import HomeIcon from "../../assets/icons/navbar/home.svg";
import RequestsIcon from "../../assets/icons/navbar/requests.svg";
import JobsIcon from "../../assets/icons/navbar/jobs.svg";
import FindCarersIcon from "../../assets/icons/navbar/findcarers.svg";
import PetsIcon from "../../assets/icons/navbar/pets.svg";
import ProfileIcon from "../../assets/icons/navbar/profile.svg";

export interface Route {
  key: string;
  title: string;
  focusedIcon: IconSource;
  unfocusedIcon: IconSource;
}

const carerRoutes = [
  {
    key: "home",
    title: "Home",
    focusedIcon: () => <HomeIcon height={25} fill={"#FFFFFF"} />,
    unfocusedIcon: () => <HomeIcon height={25} fill={"#49454F"}/>,
  },
  {
    key: "carer/offers",
    title: "Requests",
    focusedIcon: () => <RequestsIcon height={25} fill={"#FFFFFF"} />,
    unfocusedIcon: () => <RequestsIcon height={25} fill={"#49454F"} />,
  },
  {
    key: "carer/jobs",
    title: "Jobs",
    focusedIcon: () => <JobsIcon height={25} fill={"#FFFFFF"} />,
    unfocusedIcon: () => <JobsIcon height={25} fill={"#49454F"} />,
  },
  {
    key: "profile",
    title: "Profile",
    focusedIcon: () => <ProfileIcon height={25} fill={"#FFFFFF"} />,
    unfocusedIcon: () => <ProfileIcon height={25} fill={"#49454F"} />,
  },
];

const ownerRoutes = [
  {
    key: "home",
    title: "Home",
    focusedIcon: () => <HomeIcon height={25} fill={"#FFFFFF"} />,
    unfocusedIcon: () => <HomeIcon height={25} fill={"#49454F"}/>,
  },
  {
    key: "owner/requests",
    title: "Requests",
    focusedIcon: () => <RequestsIcon height={25} fill={"#FFFFFF"} />,
    unfocusedIcon: () => <RequestsIcon height={25} fill={"#49454F"} />,
  },
  {
    key: "owner/search",
    title: "Find Carers",
    focusedIcon: () => <FindCarersIcon height={25} fill={"#FFFFFF"} />,
    unfocusedIcon: () => <FindCarersIcon height={25} fill={"#49454F"} />,
  },
  {
    key: "owner/pets",
    title: "Pets",
    focusedIcon: () => <PetsIcon height={25} fill={"#FFFFFF"} />,
    unfocusedIcon: () => <PetsIcon height={25} fill={"#49454F"} />,
  },
  {
    key: "profile",
    title: "Profile",
    focusedIcon: () => <ProfileIcon height={25} fill={"#FFFFFF"} />,
    unfocusedIcon: () => <ProfileIcon height={25} fill={"#49454F"} />,
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
  routes: Array<Route>;
  index: number;
  onChange: (route: Route) => void;
}

function UserBottomNav({ routes, index, onChange }: UserBottomNavProps) {
  return (
    <BottomNavigation.Bar
      navigationState={{ index, routes }}
      onTabPress={({ route }) => onChange(route)}
      renderLabel={(props: {
        route: any;
      }): React.ReactNode => (
        <Text style={styles.navbarLabel}>
          {props.route.title}
        </Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  navbarLabel: {
    fontFamily: "Montserrat-Medium",
    textAlign: "center",
    fontSize: 12
  }
});