/**
 * @file Base layout for the authed routes
 * @author George Bull
 */

import { Stack, useRouter, useSegments } from "expo-router";
import { useAuth } from "../../contexts/auth";
import { useEffect, useState } from "react";
import { Text, BottomNavigation, Portal } from "react-native-paper";
import { StyleSheet } from "react-native";
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";

import HomeIcon from "../../../assets/icons/navbar/home.svg";
import RequestsIcon from "../../../assets/icons/navbar/requests.svg";
import JobsIcon from "../../../assets/icons/navbar/jobs.svg";
import FindCarersIcon from "../../../assets/icons/navbar/findcarers.svg";
import PetsIcon from "../../../assets/icons/navbar/pets.svg";
import ProfileIcon from "../../../assets/icons/navbar/profile.svg";
import { MessageSnackbarProvider } from "../../contexts/messageSnackbar";
import { UserContextProvider } from "../../contexts/user";
import { ProfileContextProvider } from "../../contexts/profile";
import { RequestContextProvider } from "../../contexts/requests";
import { PetsContextProvider } from "../../contexts/pets";
import { OffersContextProvider } from "../../contexts/offers";

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
    unfocusedIcon: () => <HomeIcon height={25} fill={"#49454F"} />,
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
    key: "profile/overview",
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
    unfocusedIcon: () => <HomeIcon height={25} fill={"#49454F"} />,
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
    key: "profile/overview",
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

  const tokenUser = getTokenUser();

  const routes = tokenUser?.type === "owner" ? ownerRoutes : carerRoutes;

  const isInMoreInfo = segments[1] === "more-info";

  useEffect(() => {
    const path = segments.filter((s) => s.match(/\(/) === null).join("/");
    console.log(path);
    setIndex(routes.findIndex((r) => r.key === path));
  }, [segments]);

  if (!tokenUser) return null;

  return (
    <MessageSnackbarProvider>
      <UserContextProvider>
        <ProfileContextProvider>
          <Portal.Host>
            {tokenUser.type === "owner" ? (
              <RequestContextProvider>
                <PetsContextProvider>
                  <Stack />
                </PetsContextProvider>
              </RequestContextProvider>
            ) : (
              <OffersContextProvider>
                <Stack />
              </OffersContextProvider>
            )}
          </Portal.Host>
          <UserBottomNav
            routes={routes}
            index={index}
            onChange={(route: Route) => {
              console.log(route);
              setIndex(routes.findIndex((r) => r.key === route.key));
              router.replace(
                route.key === "profile/overview"
                  ? {
                      pathname: `/profile/overview`,
                      params: {
                        profileId: getTokenUser()?._id,
                        isSelf: "true",
                      },
                    }
                  : route.key
              );
            }}
            disabled={isInMoreInfo}
          />
        </ProfileContextProvider>
      </UserContextProvider>
    </MessageSnackbarProvider>
  );
}

interface UserBottomNavProps {
  routes: Route[];
  index: number;
  onChange: (route: Route) => void;
  disabled?: boolean;
}

function UserBottomNav({
  routes,
  index,
  onChange,
  disabled,
}: UserBottomNavProps) {
  if (disabled) return null;

  return (
    <BottomNavigation.Bar
      navigationState={{ index, routes }}
      onTabPress={({ route }) => onChange(route)}
      renderLabel={({ route }: { route: Route }): React.ReactNode => (
        <Text style={styles.navbarLabel}>{route.title}</Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  navbarLabel: {
    textAlign: "center",
    fontSize: 12,
  },
});
