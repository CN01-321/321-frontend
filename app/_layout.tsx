import { Slot } from "expo-router";
import {
  MD3LightTheme,
  PaperProvider,
  configureFonts,
} from "react-native-paper";
import { AuthProvider, useAuth } from "../contexts/auth";
import { CARER_COLOUR, ERROR_COLOUR, OWNER_COLOUR } from "../types/types";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

function LayoutWithTheme() {
  const { getTokenUser } = useAuth();

  const colour = getTokenUser()?.type === "owner" ? OWNER_COLOUR : CARER_COLOUR;

  const baseFont = {
    fontFamily: "Montserrat-Regular",
  };

  const baseVariants = configureFonts({ config: baseFont });

  const montserratVariants = {
    titleSmall: {
      ...baseVariants.titleSmall,
      fontFamily: "Montserrat-Bold",
    },
    titleMedium: {
      ...baseVariants.titleMedium,
      fontFamily: "Montserrat-Bold",
    },
    titleLarge: {
      ...baseVariants.titleLarge,
      fontFamily: "Montserrat-Bold",
    },
    headlineSmall: {
      ...baseVariants.headlineSmall,
      fontFamily: "Montserrat-Bold",
    },
    headlineMedium: {
      ...baseVariants.headlineMedium,
      fontFamily: "Montserrat-Bold",
    },
    headlineLarge: {
      ...baseVariants.headlineLarge,
      fontFamily: "Montserrat-Bold",
    },
  };

  const fonts = configureFonts({
    config: {
      ...baseVariants,
      ...montserratVariants,
    },
  });

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
    fonts,
  };

  return (
    <PaperProvider theme={theme}>
      <Slot />
    </PaperProvider>
  );
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  if (!fontsLoaded) return null;
  return (
    <AuthProvider>
      <LayoutWithTheme />
    </AuthProvider>
  );
}
