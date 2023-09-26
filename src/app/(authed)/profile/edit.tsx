import { View, ScrollView } from "react-native";
import axios from "axios";
import EditOwnerProfileForm from "../../../components/forms/EditOwnerProfileForm";
import EditCarerProfileForm from "../../../components/forms/EditCarerProfileForm";
import Header from "../../../components/Header";
import { OwnerProfile, CarerProfile } from "../../../types/types";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/auth";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";

function isOwner(user: OwnerProfile | CarerProfile): user is OwnerProfile {
  return user.userType === "owner";
}

const EditProfile = () => {
  const [user, setUser] = useState<OwnerProfile | CarerProfile>();
  const { getTokenUser } = useAuth();
  const { pushError } = useMessageSnackbar();

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get(`/users/${getTokenUser()?._id}`);
        if (!ignore) setUser(data);
      } catch (e) {
        console.error(e);
        pushError("Could not fetch profile information");
      }
    })();

    return () => (ignore = true);
  }, []);

  if (!user) return null;

  return (
    <View>
      <Header title="Edit Profile" />
      <ScrollView>
        {isOwner(user) ? (
          <EditOwnerProfileForm owner={user} />
        ) : (
          <EditCarerProfileForm carer={user} />
        )}
      </ScrollView>
    </View>
  );
};

export default EditProfile;
