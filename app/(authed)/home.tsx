import { Button, Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { useAuth } from "../../contexts/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { User } from "../../types";

export default function Home() {
  const { getTokenUser, logOut } = useAuth();

  const [user, setUser] = useState<User>();

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get(`/users/${getTokenUser()?._id}`);
        if (!ignore) setUser(data);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => (ignore = true);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Home" showButtons={true} />
      <View>
        <Text variant="titleLarge" style={styles.title}>
          Hi, {user?.name}
        </Text>
        <Button style={styles.logout} onPress={logOut}>
          Log out
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 40,
    textAlign: "center",
    padding: 40,
  },
  logout: {
    paddingTop: "100%",
  },
});
