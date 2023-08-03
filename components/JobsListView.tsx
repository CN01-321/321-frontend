import { FlatList, View } from "react-native";
import { Job, JobType } from "../types";
import RequestCard from "./RequestCard";

interface OffersListViewProps {
  jobs: Job[];
  jobType: "direct" | "broad";
  updateOffers: () => Promise<void>;
}

interface JobsListViewProps {
  jobs: Array<Job>;
  jobType: "job";
}

export default function JobsListView(
  props: OffersListViewProps | JobsListViewProps
) {
  const getPropUpdateOffers = () => {
    if (props.jobType === "job") {
      return async () => {};
    }

    return props.updateOffers;
  };

  return (
    <View>
      <FlatList
        data={props.jobs}
        renderItem={({ item }) => (
          <RequestCard
            job={item}
            jobType={props.jobType}
            updateOffers={getPropUpdateOffers()}
          />
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}
