import { FlatList } from "react-native";
import { Job } from "../../types/types";
import EmptyListView, { EmptyListViewProps } from "./EmptyListView";
import JobCard from "../cards/JobCard";

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
    <FlatList
      data={jobs}
      renderItem={({ item }) => <JobCard job={item} updateJobs={onRefresh} />}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ paddingBottom: 100 }}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
}
