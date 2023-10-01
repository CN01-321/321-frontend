import { View, ScrollView } from "react-native";
import EditOwnerProfileForm from "../../../components/forms/EditOwnerProfileForm";
import EditCarerProfileForm from "../../../components/forms/EditCarerProfileForm";
import Header from "../../../components/Header";
import { isOwner } from "../../../utilities/utils";
import { useUser } from "../../../contexts/user";

export default function EditProfile() {
  const { getUser } = useUser();

  const user = getUser();
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
