import { View } from "react-native";
import JobsListView from "../../../components/JobsListView";
import { useEffect, useState } from "react";
import axios from "axios";
import { Stack } from "expo-router";
import { Job } from "../../../types";
import Header from "../../../components/Header";

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
      <Header title="Jobs" />
      <JobsListView jobs={jobs} jobType="job" />
    </View>
  );
}
