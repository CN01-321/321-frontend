/**
 * @file Shows an empty view with a graphic for list views that have no elements
 * @author George Bull
 */

import { View } from "react-native";
import { UserType } from "../../types/types";

import EmptyListOwner from "../../../assets/EmptyListOwner.svg";
import EmptyListCarer from "../../../assets/EmptyListCarer.svg";
import { Text, useTheme } from "react-native-paper";

export interface EmptyListViewProps {
  userType: UserType;
  emptyTitle: string;
  emptySubtitle: string;
}

export default function EmptyListView({
  userType,
  emptyTitle,
  emptySubtitle,
}: EmptyListViewProps) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{ padding: 40, justifyContent: "center", alignItems: "center" }}
      >
        {userType === "owner" ? <EmptyListOwner /> : <EmptyListCarer />}
      </View>
      <Text
        variant="titleLarge"
        style={{ textAlign: "center", padding: 10, fontSize: 35 }}
      >
        {emptyTitle}
      </Text>
      <Text variant="bodyMedium" style={{ textAlign: "center" }}>
        {emptySubtitle}
      </Text>
    </View>
  );
}
