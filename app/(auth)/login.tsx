import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput, Title } from "react-native-paper";
import { useAuth } from "../../contexts/auth";
import axios from "axios";

type GetToken = {
  token: string;
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn } = useAuth();

  const login = async () => {
    try {
      const { data } = await axios.post<GetToken>("/login", {
        email,
        password,
      });
      console.log("new token in login.tsx", data.token);
      await logIn(data.token);
      console.log(`logged in with: ${email} and ${password}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Title>Log In</Title>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        label="Password"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />

      <Button mode="contained" onPress={login}>
        Login
      </Button>
    </View>
  );
}
