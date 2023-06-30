import { Stack } from "expo-router";
import { UserType, useAuth } from "../../contexts/auth";
import UserBottomNav from "../../components/UserBottomNav";

export default function UserLayout() {
  const { getUser } = useAuth();

  return (
    <>
      <Stack />
      <UserBottomNav userType={getUser()?.type ?? "owner"} />
    </>
  );
}
