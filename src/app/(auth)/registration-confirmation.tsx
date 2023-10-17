/**
 * @file Registration confirmation page
 * @author Matthew Kolega
 */

import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { Button, Text, useTheme } from "react-native-paper";
import { UserType, CARER_COLOUR, OWNER_COLOUR } from "../../types/types";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

export default function RegistrationConfirmation() {
  const { userType } = useLocalSearchParams<{ userType: UserType }>();
  const router = useRouter();
  const theme = useTheme();

  const colour = userType === "owner" ? OWNER_COLOUR : CARER_COLOUR;

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background }}>
      <Stack.Screen
        options={{
          animation: "slide_from_right",
        }}
      />
      <Header title="Registration" showHeader={false} />
      <View style={styles.view}>
        <Text style={styles.heading}>{`Registration\nSuccessful!`}</Text>
        <Text style={styles.subheading}>
          Begin your journey with us as a pet{" "}
          {userType === "owner" ? "owner" : "carer"}
        </Text>
        <View style={styles.graphicContainer}>
          <Image
            style={styles.graphicImage}
            contentFit="contain"
            source={
              userType === "owner"
                ? require("../../../assets/illustrations/registrationsuccess-owner.png")
                : require("../../../assets/illustrations/registrationsuccess-carer.png")
            }
          />
        </View>
        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          onPress={() => {
            router.replace({ pathname: "/login", params: { userType } });
          }}
          theme={{ colors: { primary: colour } }}
        >
          Continue
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    paddingLeft: 40,
    paddingRight: 40,
  },
  heading: {
    fontFamily: "Montserrat-Bold",
    fontSize: 40,
    color: "#2F2E41",
    marginTop: 30,
    marginBottom: 20,
  },
  subheading: {
    fontFamily: "Montserrat-Medium",
    fontSize: 15,
    color: "#2F2E41E0",
    marginBottom: 50,
  },
  graphicContainer: {
    width: "100%",
    height: 500,
    display: "flex",
    alignItems: "center",
  },
  graphicImage: {
    width: "90%",
    height: "90%",
  },
  button: {
    borderRadius: 50,
  },
  buttonContent: {
    height: 60,
  },
  buttonLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    color: "#FFFFFF",
    paddingTop: 5,
  },
});
