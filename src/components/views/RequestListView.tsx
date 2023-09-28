import { FlatList } from "react-native";
import { Request } from "../../types/types";
import EmptyListView, { EmptyListViewProps } from "./EmptyListView";
import RequestCard from "../cards/RequestCard";
import { useTheme } from "react-native-paper";

interface RequestListViewProps extends Omit<EmptyListViewProps, "userType"> {
  requests: Request[];
}

export default function RequestListView({
  requests,
  emptyTitle,
  emptySubtitle,
}: RequestListViewProps) {
  const theme = useTheme();

  if (requests.length === 0) {
    return (
      <EmptyListView
        userType="owner"
        emptyTitle={emptyTitle}
        emptySubtitle={emptySubtitle}
      />
    );
  }

  return (
    <FlatList
      data={requests}
      renderItem={({ item }) => <RequestCard request={item} />}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ backgroundColor: theme.colors.background }}
    />
  );
}
