import { Slot } from "expo-router";
import { MD3LightTheme, PaperProvider } from "react-native-paper";
import { AuthProvider } from "../contexts/auth";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // colours of primary objects and containers
    primary: "#a87351",
    primaryContainer: "#a87351",
    // colours of text on primary objects and containers
    onPrimary: "#ffffff",
    onPrimaryContainer: "#ffffff",

    secondary: "#a87351",
    secondaryContainer: "#a87351",
    onSecondary: "#ffffff",
    onSecondaryContainer: "#ffffff",

    tertiary: "#a87351",
    tertiaryContainer: "#a87351",
    onTertiary: "#ffffff",
    onTertiaryContainer: "#311300",

    error: "#eb2c2c",
    errorContainer: "#eb2c2c",
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

export default function Layout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </PaperProvider>
  );
}
