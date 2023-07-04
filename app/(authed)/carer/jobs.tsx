import { View } from "react-native";
import { Text } from "react-native-paper";
import JobsListView, { Job } from "../../../components/JobsListView";
import { useEffect, useState } from "react";

const jobsData: Array<Job> = [
  {
    jobId: "0",
    ownerId: "0",
    ownerName: "Owner Name",
    ownerIcon: "icon",
    pets: [
      { petId: "0", petName: "pet", petType: "dog" },
      { petId: "1", petName: "pet", petType: "cat" },
      { petId: "2", petName: "pet", petType: "bird" },
      { petId: "3", petName: "pet", petType: "rabbit" },
    ],
    requestedDate: new Date(),
    distance: 3,
    startDate: new Date(),
    endDate: new Date(),
    location: "wollongong",
    additionalInfo: "looking for someone to care for my pets",
  },
];

export default function Jobs() {
  const [jobs, setJobs] = useState<Array<Job>>([]);

  useEffect(() => {
    setJobs(jobsData);
  }, []);

  return (
    <View>
      <JobsListView jobs={jobs} jobType="job" />
    </View>
  );
}
