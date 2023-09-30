import { useLocalSearchParams, useRouter } from "expo-router";
import { CARER_COLOUR, OWNER_COLOUR, UserType } from "../../types/types";
import { Image, ImageBackground } from "expo-image";
import { Text, Button, useTheme } from "react-native-paper";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Header from "../../components/Header";

const ownerGetStartedImg = require("../../../assets/illustrations/owner-get-started.png");
const carerGetStartedImg = require("../../../assets/illustrations/carer-get-started.png");

const ownerLogo = require("../../../assets/illustrations/logo-yellow.png");
const carerLogo = require("../../../assets/illustrations/carer-logo.png");

const ownerTitle = "Find Loving Sitters to Care For Your Furry Family";
const carerTitle = "Earn Extra Money with Your Love for Pets";

export default function GetStarted() {
  const { userType } = useLocalSearchParams<{ userType: UserType }>();
  const router = useRouter();
  const theme = useTheme();

  const colour = userType === "owner" ? OWNER_COLOUR : CARER_COLOUR;
  const logo = userType === "owner" ? ownerLogo : carerLogo;
  const title = userType === "owner" ? ownerTitle : carerTitle;
  const getStartedImg =
    userType == "owner" ? ownerGetStartedImg : carerGetStartedImg;

  const routeToSignup = () => {
    router.push({ pathname: "/(auth)/signup", params: { userType } });
  };

  const routeToLogin = () => {
    router.push({ pathname: "/(auth)/login", params: { userType } });
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        height: "100%",
      }}
    >
      <Header title="Get Started" showHeader={false} />
      <View style={styles.logoContainer}>
        <Image
          style={styles.logoImage}
          contentFit="contain"
          contentPosition="left"
          source={logo}
        />
      </View>
      <ImageBackground
        source={getStartedImg}
        style={{ width: "80%", height: "70%", alignSelf: "center" }}
        contentFit="contain"
      >
        <Text style={styles.heading}>{title}</Text>
      </ImageBackground>
      <Button
        mode="contained"
        onPress={routeToSignup}
        theme={{ colors: { primary: colour } }}
        style={{
          width: "80%",
          alignSelf: "center",
        }}
        labelStyle={{
          fontSize: 15,
          fontFamily: "Montserrat-SemiBold",
        }}
      >
        Get Started
      </Button>
      <Text variant="bodyMedium" style={{ textAlign: "center", padding: 10 }}>
        Already registered?{" "}
        <Text onPress={routeToLogin} style={{ color: colour }}>
          Sign in
        </Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    width: "35%",
    height: 60,
    marginLeft: "5%",
    marginTop: "15%",
  },
  graphicContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: -110,
    left: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  logoImage: {
    width: "100%",
    height: "100%",
  },
  graphicImage: {
    width: "80%",
    height: "80%",
  },
  heading: {
    zIndex: 0,
    fontFamily: "Montserrat-Bold",
    fontSize: 25,
    color: "#312F4A",
    width: "90%",
  },
});
