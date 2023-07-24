import { FlatList, View } from "react-native";
import { Job, JobType } from "../types";
import RequestCard from "./RequestCard";

interface JobsListViewProps {
  jobs: Array<Job>;
  jobType: JobType;
}

export default function JobsListView({ jobs, jobType }: JobsListViewProps) {
  return (
    <View>
      <FlatList
        data={jobs}
        renderItem={({ item }) => <RequestCard req={item} jobType={jobType} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}
