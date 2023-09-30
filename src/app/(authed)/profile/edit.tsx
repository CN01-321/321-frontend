import { View, ScrollView } from "react-native";
import EditOwnerProfileForm from "../../../components/forms/EditOwnerProfileForm";
import EditCarerProfileForm from "../../../components/forms/EditCarerProfileForm";
import Header from "../../../components/Header";
import { OwnerProfile, CarerProfile } from "../../../types/types";
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/auth";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import { isOwner } from "../../../utilities/utils";
import { fetchData } from "../../../utilities/fetch";

export default function EditProfile() {
  const [user, setUser] = useState<OwnerProfile | CarerProfile>();
  const { getTokenUser } = useAuth();
  const { pushError } = useMessageSnackbar();

  useEffect(() => {
    fetchData(`/users/${getTokenUser()?._id}`, setUser, () =>
      pushError("Could not fetch profile information")
    );
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
}
