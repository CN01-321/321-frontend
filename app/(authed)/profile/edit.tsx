import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import EditProfileForm from "../../../components/EditProfileForm";
import Header from "../../../components/Header";
import { User } from "../../../types";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/auth";
import { useErrorSnackbar } from "../../../contexts/errorSnackbar";

const EditProfile = () => {
  const [user, setUser] = useState<User>();
  const { getTokenUser } = useAuth();
  const { pushError } = useErrorSnackbar();

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<User>(`/users/${getTokenUser()?._id}`);
        if (!ignore) setUser(data);
      } catch (e) {
        console.error(e);
        pushError("Could not fetch profile information");
      }
    })();

    return () => (ignore = true);
  }, []);

  return (
    <View>
      <Header title="Edit Profile" />
      <ScrollView>
        {user == null ? null : <EditProfileForm user={user} />}
      </ScrollView>
    </View>
  );
};

export default EditProfile;
