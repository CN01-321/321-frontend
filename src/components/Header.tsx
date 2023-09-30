import { Stack, useRouter } from "expo-router";
import { IconButton } from "react-native-paper";

interface HeaderProps {
  title: string;
  showHeader?: boolean;
  showBack?: boolean;
  showButtons?: boolean;
}

export default function Header({
  title,
  showHeader,
  showBack,
  showButtons,
}: HeaderProps) {
  const router = useRouter();
  const buttons = showButtons
    ? () => (
        <>
          <IconButton
            icon="bell"
            onTouchStart={() => router.push("notifications")}
          />
          <IconButton
            icon="cog-outline"
            onTouchStart={() => router.push("settings")}
          />
        </>
      )
    : undefined;

  return (
    <Stack.Screen
      options={{
        headerTitle: title,
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
