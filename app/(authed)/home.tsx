import { Button, Title, Text, IconButton } from "react-native-paper";
import { View } from "react-native";
import { useAuth } from "../../contexts/auth";
import { useState } from "react";
import axios from "axios";
import { Stack, useNavigation } from "expo-router";
import Header from "../../components/Header";

export default function Home() {
  const [message, setMessage] = useState("No message");
  const { logOut } = useAuth();

  const navigation = useNavigation();

  const getMessage = async () => {
    try {
      const { data } = await axios.get<string>("/needs-token");
      setMessage(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Header title="Home" showButtons={true} />
      <View>
        <Title>Home Page</Title>
        <Button onPress={logOut}>Log out</Button>
        <Button onPress={getMessage}>Get Message</Button>
        <Text>{message}</Text>
      </View>
    </>
  );
}
