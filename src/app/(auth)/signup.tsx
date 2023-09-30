import { CARER_COLOUR, OWNER_COLOUR, UserType } from "../../types/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import axios from "axios";
import { View, StyleSheet } from "react-native";
import { Button, Text, IconButton } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Header from "../../components/Header";
import EditableTextbox from "../../components/EditableTextbox";
import { SafeAreaView } from "react-native-safe-area-context";

type FormData = {
  email: string;
  password: string;
};

export default function SignUp() {
  const { userType } = useLocalSearchParams<{ userType: UserType }>();
  const router = useRouter();

  const { control, handleSubmit } = useForm<FormData>({});

  const signup: SubmitHandler<FormData> = async (formData) => {
    try {
      await axios.post(`/${userType}s`, formData);

      console.log(
        `created new ${userType} with: ${formData.email} and ${formData.password}`
      );
      router.replace({ pathname: "/registrationconfirmation", params: { userType } });
    } catch (error) {
      console.error(error);
    }
  };

  const colour = userType === "owner" ? OWNER_COLOUR : CARER_COLOUR;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.graphicContainer}>
        <Image
          style={styles.graphicImage} 
          contentFit="contain"
          source={
            userType == "owner" 
              ? require("../../../assets/illustrations/paws-yellow.png")
              : require("../../../assets/illustrations/paws-brown.png")
          }
        />
      </View>
      <Header title="Sign Up" showHeader={false} />
      <IconButton icon="arrow-left" onPress={() => router.back()} />
      <View style={styles.view}>
        <Text style={styles.heading}>Let&apos;s Start Here</Text>
        <Text style={styles.subheading}>Sign in to your account</Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <EditableTextbox
              label="Email"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              outlineColor="#9797975E"
              activeOutlineColor={colour}
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <EditableTextbox
              label="Password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry
              outlineColor="#9797975E"
              activeOutlineColor={colour}
              autoCapitalize="none"
            />
          )}
        />
        <Button
          mode="contained"
          style={styles.signUpButton}
          labelStyle={styles.signUpButtonLabel}
          contentStyle={styles.signUpButtonContent}
          onPress={handleSubmit(signup)}
          theme={{ colors: { primary: colour } }}
        >
          Sign Up
        </Button>
        {/* <View style={styles.centeredTextContainer}>
          <Text style={styles.connectWithText}>- Or Connect With -</Text>
        </View> */}
      </View>
      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>By signing up, I agree with <Text style={[styles.bottomText, styles.highlightedText, { color: colour }]}>Terms of Use</Text> and <Text style={[styles.bottomText, styles.highlightedText, { color: colour }]}>Privacy Policy</Text></Text>
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
    fontSize: 36,
    color: "#2F2E41",
    marginTop: 50,
    marginBottom: 5,
  },
  subheading: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#2F2E41E1",
    marginBottom: 35,
  },
  graphicContainer: {
    position: "absolute",
    left: 0,
    top: -350,
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center"
  },
  graphicImage: {
    width: "45%",
  },
  signUpButton: {
    marginTop: 30,
    borderRadius: 50,
    marginBottom: 40,
  },
  signUpButtonLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 22,
    color: "#FFFFFF",
    paddingTop: 5,
  },
  signUpButtonContent: {
    height: 55,
  },
  centeredTextContainer: {
    display: "flex",
    alignItems: "center",
  },
  connectWithText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#000000A6",
    marginBottom: 25,
  },
  bottomTextContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 30,
    width: "100%",
    paddingLeft: 40,
    paddingRight: 40,
  },
  bottomText: {
    textAlign: "center",
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#00000094"
  },
  highlightedText: {
    fontFamily: "Montserrat-Bold",
    textDecorationLine: "underline",
  },
});