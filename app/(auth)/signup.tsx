import { useState } from "react";
import { CARER_COLOUR, OWNER_COLOUR, UserType } from "../../types/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { View } from "react-native";
import { Button, Title } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import Header from "../../components/Header";
import EditableTextbox from "../../components/EditableTextbox";

type FormData = {
  email: string;
  password: string;
}

export default function SignUp() {
  const { userType } = useLocalSearchParams<{ userType: UserType }>();
  const router = useRouter();

  const { control, handleSubmit } = useForm<FormData>({});

  const signup: SubmitHandler<FormData> = async (formData) => {
    try {
      await axios.post(`/${userType}s`, formData);

      console.log(`created new ${userType} with: ${formData.email} and ${formData.password}`);
      router.replace({ pathname: "/login", params: { userType } });
    } catch (error) {
      console.error(error);
    }
  };

  const colour = userType === "owner" ? OWNER_COLOUR : CARER_COLOUR;

  return (
    <View>
      <Header title="Sign Up" />
      <Title>Sign up as {userType}</Title>
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
          />
        )}
      />
      <Button
        mode="contained"
        onPress={handleSubmit(signup)}
        theme={{ colors: { primary: colour } }}
      >
        Sign up
      </Button>
    </View>
  );
}
