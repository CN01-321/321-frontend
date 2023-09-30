import { View, StyleSheet } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Image } from "expo-image";
import { useAuth } from "../../contexts/auth";
import { CARER_COLOUR, OWNER_COLOUR, UserType } from "../../types/types";
import axios, { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/Header";
import ThemedTextInput from "../../components/ThemedTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import ErrorText from "../../components/ErrorText";

type GetToken = {
  token: string;
};

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const { userType } = useLocalSearchParams<{ userType: UserType }>();
  const { logIn } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const colour = userType === "owner" ? OWNER_COLOUR : CARER_COLOUR;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({});

  const login: SubmitHandler<FormData> = async (formData) => {
    try {
      const { data } = await axios.post<GetToken>("/login", formData);
      console.log("new token in login.tsx", data.token);
      await logIn(data.token);
      console.log(`logged in with: ${formData.email} and ${formData.password}`);
      router.replace("/home");
    } catch (err) {
      console.error(err);
      if (err instanceof AxiosError) {
        console.log(JSON.stringify({ ...err }, null, 2));
        if (err.response?.status === 401) {
          setError("password", {
            message: "Username or password is incorrect",
          });
        }
      }
    }
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.colors.background, height: "100%" }}
    >
      <View style={styles.graphicContainer}>
        <Image
          style={styles.graphicImage}
          source={
            userType == "owner"
              ? require("../../../assets/illustrations/catpaw-yellow.png")
              : require("../../../assets/illustrations/dogpaw-brown.png")
          }
        />
      </View>
      <Header title="Log In" showHeader={false} />
      <IconButton
        icon="arrow-left"
        onPress={() => router.replace("/landing")}
      />
      <View style={styles.view}>
        <Text style={styles.heading}>Hello there.</Text>
        <Text style={styles.subheading}>Sign in to your account</Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedTextInput
              label="Email"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              outlineColor={colour}
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
            <ThemedTextInput
              label="Password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry
              outlineColor={colour}
              activeOutlineColor={colour}
            />
          )}
        />
        <ErrorText>{errors.password?.message}</ErrorText>
        <View style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
        </View>
        <Button
          mode="contained"
          style={styles.signInButton}
          labelStyle={styles.signInButtonLabel}
          contentStyle={styles.signInButtonContent}
          onPress={handleSubmit(login)}
          theme={{ colors: { primary: colour } }}
        >
          Sign In
        </Button>
        <View style={styles.centeredTextContainer}>
          <Text style={styles.loginWithText}>- Or Login With -</Text>
        </View>
        <View style={[styles.centeredTextContainer, { marginBottom: 50 }]}>
          <Text style={styles.bottomText}>
            Don&apos;t have an account?{" "}
            <Text
              style={[
                styles.bottomText,
                styles.highlightedText,
                { color: colour },
              ]}
            >
              Sign Up
            </Text>
          </Text>
        </View>
        <View style={styles.centeredTextContainer}>
          <Text style={styles.bottomText}>
            By signing in, I agree with{" "}
            <Text
              style={[
                styles.bottomText,
                styles.highlightedText,
                { color: colour },
              ]}
            >
              Terms of Use
            </Text>{" "}
            and{" "}
            <Text
              style={[
                styles.bottomText,
                styles.highlightedText,
                { color: colour },
              ]}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
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
    top: 90,
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  graphicImage: {
    height: "30%",
    width: "30%",
  },
  forgotPasswordContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  forgotPasswordText: {
    fontFamily: "Montserrat-Medium",
    textDecorationLine: "underline",
    fontSize: 12,
    color: "#00000080",
    marginBottom: 25,
  },
  signInButton: {
    borderRadius: 50,
    marginBottom: 40,
  },
  signInButtonLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 22,
    color: "#FFFFFF",
    paddingTop: 5,
  },
  signInButtonContent: {
    height: 55,
  },
  centeredTextContainer: {
    display: "flex",
    alignItems: "center",
  },
  loginWithText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#000000A6",
    marginBottom: 25,
  },
  bottomText: {
    textAlign: "center",
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#00000094",
  },
  highlightedText: {
    fontFamily: "Montserrat-Bold",
    textDecorationLine: "underline",
  },
});
