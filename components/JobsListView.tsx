import { FlatList, View } from "react-native";
import { Job } from "../types/types";
import JobCard from "./cards/JobCard";

interface JobsListViewProps {
  jobs: Job[];
  updateJobs: () => Promise<void>;
}

export default function JobsListView({ jobs, updateJobs }: JobsListViewProps) {
  return (
    <View>
      <FlatList
        data={jobs}
        renderItem={({ item }) => (
          <JobCard job={item} updateJobs={updateJobs} />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
