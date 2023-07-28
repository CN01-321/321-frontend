import { useState } from "react";
import { UserType } from "../../contexts/auth";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { View } from "react-native";
import { Button, TextInput, Title } from "react-native-paper";

export default function SignUp() {
  const { userType } = useLocalSearchParams<{ userType: UserType }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signup = async () => {
    try {
      await axios.post(`/${userType}s`, {
        email,
        password,
      });

      console.log(`created new ${userType} with: ${email} and ${password}`);
      router.replace({ pathname: "/login", params: { userType } });
    } catch (error) {
      console.error(error);
    }
  };

  const colour = userType === "owner" ? "brown" : "yellow";

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Sign Up",
        }}
      />
      <Title>Sign up as {userType}</Title>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        theme={{ colors: { primary: colour } }}
      />
      <TextInput
        label="Password"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        theme={{ colors: { primary: colour } }}
      />
      <Button
        mode="contained"
        onPress={signup}
        theme={{ colors: { primary: colour } }}
      >
        Sign up
      </Button>
    </View>
  );
}