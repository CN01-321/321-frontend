import { View } from "react-native";
import { Text } from "react-native-paper";
import JobsListView, { Job } from "../../../components/JobsListView";
import { useEffect, useState } from "react";
import axios from "axios";

// const jobsData: Array<Job> = [
//   {
//     jobId: "0",
//     ownerId: "0",
//     ownerName: "Owner Name",
//     ownerIcon: "icon",
//     pets: [
//       { petId: "0", petName: "pet", petType: "dog" },
//       { petId: "1", petName: "pet", petType: "cat" },
//       { petId: "2", petName: "pet", petType: "bird" },
//       { petId: "3", petName: "pet", petType: "rabbit" },
//     ],
//     requestedDate: new Date(),
//     distance: 3,
//     startDate: new Date(),
//     endDate: new Date(),
//     location: "wollongong",
//     additionalInfo: "looking for someone to care for my pets",
//   },
// ];

export default function Jobs() {
  const [jobs, setJobs] = useState<Array<Job>>([]);

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<Array<Job>>(`/carers/jobs`);

        // map all date strings to date objects
        const jobs = data.map((o) => {
          return {
            ...o,
            requestedOn: new Date(o.requestedOn),
            dateRange: {
              startDate: new Date(o.dateRange.startDate),
              endDate: new Date(o.dateRange.endDate),
            },
          };
        });

        console.log(jobs);

        if (!ignore) {
          setJobs(jobs);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => (ignore = true);
  }, []);

  return (
    <View>
      <JobsListView jobs={jobs} jobType="job" />
    </View>
  );
}
