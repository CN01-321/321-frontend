import { View } from "react-native";
import { Text } from "react-native-paper";
import JobsListView, { Job } from "../../../components/JobsListView";
import { useEffect, useState } from "react";
import axios from "axios";

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
