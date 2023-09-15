import { View } from "react-native";
import JobsListView from "../../../components/JobsListView";
import { useEffect, useState } from "react";
import axios from "axios";
import { Job } from "../../../types";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const { pushError } = useMessageSnackbar();

  const updateJobs = async () => {
    try {
      const { data } = await axios.get<Job[]>(`/carers/jobs`);

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

      setJobs(jobs);
    } catch (e) {
      console.error(e);
      pushError("Could not fetch Jobs");
    }
  };

  useEffect((): (() => void) => {
    let ignore = false;

    if (!ignore) updateJobs();

    return () => (ignore = true);
  }, []);

  return (
    <View>
      <Header title="Jobs" />
      <JobsListView jobs={jobs} updateJobs={updateJobs} />
    </View>
  );
}
