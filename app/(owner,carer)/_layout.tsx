import { Stack } from "expo-router";
import { UserType } from "../../contexts/auth";
import OwnerBottomNav from "../../components/OwnerBottomNav";
import CarerBottomNav from "../../components/CarerBottomNav";

export default function SharedRouteLayout({ segment }: { segment: string }) {
  console.log(segment);
  const userType: UserType = segment === "(owner)" ? "owner" : "carer";

  return (
    <>
      <Stack />
      {(userType === 'owner') ? <OwnerBottomNav /> : <CarerBottomNav />}
    </>
  );
}
