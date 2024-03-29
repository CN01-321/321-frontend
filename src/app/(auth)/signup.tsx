/**
 * @file Signup page
 * @author Matthew Kolega
 */

import { CARER_COLOUR, OWNER_COLOUR, UserType } from "../../types/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import axios, { AxiosError } from "axios";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, Text, IconButton, useTheme } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Header from "../../components/Header";
import ThemedTextInput from "../../components/ThemedTextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import ErrorText from "../../components/ErrorText";

type FormData = {
  email: string;
  password: string;
};

export default function SignUp() {
  const { userType } = useLocalSearchParams<{ userType: UserType }>();
  const router = useRouter();
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({});

  const signup: SubmitHandler<FormData> = async (formData) => {
    try {
      await axios.post(`/${userType}s`, formData);

      console.log(
        `created new ${userType} with: ${formData.email} and ${formData.password}`
      );
      router.replace({
        pathname: "/registration-confirmation",
        params: { userType },
      });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 500) {
        setError("email", {
          message: "Email address already in use!",
        });
        return;
      }
      console.error(error);
    }
  };

  const colour = userType === "owner" ? OWNER_COLOUR : CARER_COLOUR;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.graphicContainer}>
        <Image
          style={styles.graphicImage}
          contentFit="contain"
          contentPosition={"top center"}
          source={
            userType == "owner"
              ? require("../../../assets/illustrations/paws-yellow.png")
              : require("../../../assets/illustrations/paws-brown.png")
          }
        />
      </View>
      <SafeAreaView
        style={{
          backgroundColor: theme.colors.background,
          height: "100%",
        }}
      >
        <ScrollView>
          <Stack.Screen
            options={{
              animation: "slide_from_right",
            }}
          />
          <Header title="Sign Up" showHeader={false} />
          <IconButton
            icon="arrow-left"
            onPress={() => router.replace("/landing")}
          />
          <View style={styles.view}>
            <Text style={styles.heading}>Let&apos;s Start Here</Text>
            <Text style={styles.subheading}>Fill in your details</Text>
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
                  outlineColor="#9797975E"
                  activeOutlineColor={colour}
                  autoCapitalize="none"
                />
              )}
            />
            <View style={styles.errorTextContainer}>
              <ErrorText>{errors.email?.message}</ErrorText>
            </View>
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    zIndex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    display: "flex",
    width: "80%",
    marginLeft: "10%",
    marginRight: "10%",
    height: 120,
    flexDirection: "row",
    justifyContent: "center",
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
  errorTextContainer: {
    height: 18,
  },
});
