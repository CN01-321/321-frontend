import { useLocalSearchParams, useRouter } from "expo-router";
import { CARER_COLOUR, OWNER_COLOUR, UserType } from "../../types/types";
import { Text, Button } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image"
import Header from "../../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GetStarted() {
  const { userType } = useLocalSearchParams<{ userType: UserType }>();
  const router = useRouter();

  const colour = userType === "owner" ? OWNER_COLOUR : CARER_COLOUR;

  return (
    <SafeAreaView>
      <Header title="Get Started" showHeader={false} />
      <View style={styles.logoContainer}>
          <Image
            style={styles.logoImage}
            contentFit="contain"
            source={
              userType === "owner"
              ? require("../../../assets/illustrations/logo-yellow.png")
              : require("../../../assets/illustrations/logo-brown.png")
            }
          />
        </View>
      <View style={styles.view}>
        
        <Text style={styles.heading}>
          {
            userType === "owner"
            ? `Find Loving Sitters\nto Care For your\nFurry Family`
            : `Earn extra Money\nwith your Love\nfor Pets`
          }
        </Text>
        <View style={styles.graphicContainer}>
          <Image
            style={styles.graphicImage}
            contentFit="contain"
            source={
              userType === "owner"
              ? require("../../../assets/illustrations/getstarted-owner.png")
              : require("../../../assets/illustrations/getstarted-carer.png")
            }
          />
        </View>
        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          onPress={() =>
            router.push({ pathname: "/(auth)/signup", params: { userType } })
          }
          theme={{ colors: { primary: colour } }}
        >
          Get Started
        </Button>
      </View>
      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>
          Already have an account? 
        </Text>
        <Button 
          mode="text" 
          labelStyle={styles.highlightedText}
          textColor={colour}
          onPress={() => router.push({ pathname: "/(auth)/login", params: { userType } })}
        >
          Sign In
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
  logoContainer: {
    width: "35%",
    height: 60,
    marginLeft: 30,
    marginTop: "5%",
    display: "flex",
  },
  logoImage: {
    width: "100%",
    height: "100%"
  },
  heading: {
    marginTop: 20,
    fontFamily: "Montserrat-Bold",
    fontSize: 24,
    color: "#312F4A",
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
    fontSize: 22,
    color: "#FFFFFF",
    paddingTop: 5,
  },
  bottomTextContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  bottomText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#00000094"
  },
  highlightedText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    textDecorationLine: "underline",
  }
});
