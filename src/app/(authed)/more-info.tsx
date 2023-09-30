import { useEffect, useState } from "react";
import EditOwnerProfileForm from "../../components/forms/EditOwnerProfileForm";
import { useAuth } from "../../contexts/auth";
import { CarerProfile, OwnerProfile } from "../../types/types";
import { fetchData } from "../../utilities/fetch";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";
import { isOwner } from "../../utilities/utils";
import EditCarerProfileForm from "../../components/forms/EditCarerProfileForm";
import Header from "../../components/Header";

export default function MoreInfo() {
  const [user, setUser] = useState<OwnerProfile | CarerProfile>();
  const { getTokenUser } = useAuth();
  const { pushError } = useMessageSnackbar();

  const getProfile = async () => {
    await fetchData(`/users/${getTokenUser()?._id}`, setUser, () =>
      pushError("Could not fetch user profile")
    );
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (!user) return null;

  const form = isOwner(user) ? (
    <EditOwnerProfileForm owner={user} navigateOnComplete="/home" />
  ) : (
    <EditCarerProfileForm carer={user} navigateOnComplete="/home" />
  );

  return (
    <>
      <Header title="More info" showBack={false} />
      {form}
    </>
  );
}
