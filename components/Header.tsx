import { Stack, useRouter } from "expo-router";
import { IconButton } from "react-native-paper";

interface HeaderProps {
  title: string;
  showButtons?: boolean;
}

export default function Header({ title, showButtons }: HeaderProps) {
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
      }}
    />
  );
}
