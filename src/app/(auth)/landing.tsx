import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import Header from "../../components/Header";
import { CARER_COLOUR, OWNER_COLOUR } from "../../types/types";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Landing() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <View style={{ height: "100%" }}>
        <Header title="Landing" showHeader={false} />
        <View style={styles.logoContainer}>
          <Image style={styles.logoImage} contentFit="contain" contentPosition="left" source={require("../../../assets/illustrations/logo-yellow.png")} />
        </View>

        <Text style={styles.heading}>
          {`Joining Us\nToday As`}
        </Text>

        <View style={styles.graphicContainer}>
          <Image style={styles.graphicImage} contentFit="contain" contentPosition="right" source={require("../../../assets/illustrations/landing.png")} />
        </View>

        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
            <Button
              mode="elevated"
              style={styles.leftButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              buttonColor={OWNER_COLOUR}
              onPress={() =>
                router.push({
                  pathname: "/(auth)/get-started",
                  params: { userType: "owner" },
                })
              }
            >
              Pet Owner
            </Button>
          </View>
          <View style={[styles.buttonContainer, { justifyContent: "flex-end" }]}>
            <Button
              mode="elevated"
              style={styles.rightButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              buttonColor={CARER_COLOUR}
              onPress={() =>
                router.push({
                  pathname: "/(auth)/get-started",
                  params: { userType: "carer" },
                })
              }
            >
              Pet Carer
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    width: "35%",
    height: 60,
    marginLeft: "5%",
    marginTop: "5%",
    display: "flex",
  },
  graphicContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: -40,
    left: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  logoImage: {
    width: "100%",
    height: "100%"
  },
  graphicImage: {
    width: "80%",
    height: "80%",
  },
  heading: {
    fontFamily: "Montserrat-Bold",
    fontSize: 40,
    color: "#312F4A",
    marginLeft: "7%",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    top: "55%",
    left: 0,
    gap: 35,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  leftButton: {
    width: "60%",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  rightButton: {
    width: "60%",
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  buttonContent: {
    height: 80,
  },
  buttonLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 24,
    color: "#F6F7FA",
    paddingTop: 5,
  }
});
