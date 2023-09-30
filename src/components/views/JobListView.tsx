import { FlatList, View } from "react-native";
import { Job } from "../../types/types";
import EmptyListView, { EmptyListViewProps } from "./EmptyListView";
import JobCard from "../cards/JobCard";
import { useTheme } from "react-native-paper";

interface JobListViewProps extends Omit<EmptyListViewProps, "userType"> {
  jobs: Job[];
  onRefresh: () => Promise<void>;
  refreshing: boolean;
}

export default function JobListView({
  jobs,
  onRefresh,
  refreshing,
  emptyTitle,
  emptySubtitle,
}: JobListViewProps) {
  const theme = useTheme();

  if (jobs.length === 0) {
    return (
      <EmptyListView
        userType="carer"
        emptyTitle={emptyTitle}
        emptySubtitle={emptySubtitle}
      />
    );
  }

  return (
    <View style={{ backgroundColor: theme.colors.background, height: "100%" }}>
      <FlatList
        data={jobs}
        renderItem={({ item }) => <JobCard job={item} updateJobs={onRefresh} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: theme.colors.background,
        }}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}
