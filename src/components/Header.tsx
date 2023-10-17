/**
 * @file Component to configure stack header at the top of each page
 * @author George Bull
 * @author Matthew Kolega
 */

import { View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Image, ImageSource } from "expo-image";
import { IconButton } from "react-native-paper";
import { useAuth } from "../contexts/auth";

import NotificationsIcon from "../../assets/icons/notifications.svg";
import SettingsIcon from "../../assets/icons/settings.svg";

interface HeaderProps {
  title: string;
  showLogo?: boolean;
  showHeader?: boolean;
  showBack?: boolean;
  showButtons?: boolean;
}

const CircleLogo = ({ imageSource }: { imageSource: ImageSource }) => {
  return (
    <View style={{ height: 35, width: 150 }}>
      <Image
        contentFit="contain"
        style={{ height: "100%", width: "100%" }}
        source={imageSource}
      />
    </View>
  );
};

export default function Header({
  title,
  showLogo,
  showHeader,
  showBack,
  showButtons,
}: HeaderProps) {
  const router = useRouter();
  const { getTokenUser } = useAuth();
  const buttons = showButtons
    ? () => (
        <>
          <IconButton
            icon={() => (
              <NotificationsIcon height={28} width={28} fill={"#49454F"} />
            )}
            onTouchStart={() => router.push("notifications")}
          />
          <IconButton
            icon={() => (
              <SettingsIcon height={28} width={28} fill={"#49454F"} />
            )}
            onTouchStart={() => router.push("settings")}
          />
        </>
      )
    : undefined;

  return (
    <Stack.Screen
      options={{
        headerTitle: showLogo
          ? getTokenUser()?.type == "owner"
            ? () => (
                <CircleLogo
                  imageSource={require("../../assets/illustrations/circlelogo-owner.png")}
                />
              )
            : () => (
                <CircleLogo
                  imageSource={require("../../assets/illustrations/circlelogo-carer.png")}
                />
              )
          : title,
        headerRight: buttons,
        headerShown: showHeader,
        headerBackVisible: showBack ?? true,
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTitleStyle: {
          fontFamily: "Montserrat-Bold",
          fontSize: 24,
        },
      }}
    />
  );
}
