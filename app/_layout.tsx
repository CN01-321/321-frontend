import { Slot } from "expo-router";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { AuthProvider, useAuth } from "../contexts/auth";
import { CARER_COLOUR, ERROR_COLOUR, OWNER_COLOUR } from "../types";

function LayoutWithTheme() {
  const { getTokenUser } = useAuth();

  const colour = getTokenUser()?.type === "owner" ? OWNER_COLOUR : CARER_COLOUR;

  const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      // colours of primary objects and containers
      primary: colour,
      primaryContainer: colour,
      // colours of text on primary objects and containers
      onPrimary: "#ffffff",
      onPrimaryContainer: "#ffffff",

      secondary: colour,
      secondaryContainer: colour,
      onSecondary: "#ffffff",
      onSecondaryContainer: "#ffffff",

      tertiary: colour,
      tertiaryContainer: colour,
      onTertiary: "#ffffff",
      onTertiaryContainer: "#311300",

      error: ERROR_COLOUR,
      errorContainer: ERROR_COLOUR,
      onError: "#ffffff",
      onErrorContainer: "#410002",

      background: "#fcfcfc",
      onBackground: "#777777",

      elevation: {
        ...MD3LightTheme.colors.elevation,
        level0: "transparent",
        level1: "#ffffff",
        level2: "#fcfcfc",
        level3: "transparent",
        level4: "transparent",
        level5: "transparent",
      },
    },
  };

  return (
    <PaperProvider theme={theme}>
      <Slot />
    </PaperProvider>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <LayoutWithTheme />
    </AuthProvider>
  );
}
