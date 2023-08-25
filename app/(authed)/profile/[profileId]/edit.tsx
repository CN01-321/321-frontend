import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import EditProfileForm from "../../../../components/EditProfileForm";
import Header from "../../../../components/Header";
import { User } from "../../../../types";
import { useEffect, useState } from "react";

const EditProfile = () => {
  const { profileId } = useLocalSearchParams<{
    profileId: string;
  }>();

  const [user, setUser] = useState<User>();

  const getUser = async (profileId: string) => {
    const { data } = await axios.get<User>(`/users/${profileId}`);
    return data;
  }

  useEffect(() => {
    const updateProfileInfo = async () => {
      const user = await getUser(profileId!);
      setUser(user);
    }
    updateProfileInfo();
  }, [])

  return (
    <View>
      <Header title="Edit Profile" />
      <ScrollView>
        {user == null ? null : <EditProfileForm user={user} />}
      </ScrollView>
    </View>
  );
}
 
export default EditProfile;