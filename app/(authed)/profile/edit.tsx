import { View, ScrollView } from "react-native";
import axios from "axios";
import EditProfileForm from "../../../components/EditProfileForm";
import Header from "../../../components/Header";
import { User } from "../../../types";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/auth";

const EditProfile = () => {
  const [user, setUser] = useState<User>();
  const { getTokenUser } = useAuth();

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      const { data } = await axios.get<User>(`/users/${getTokenUser()?._id}`);
      console.log(data);
      if (!ignore) setUser(data);
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
