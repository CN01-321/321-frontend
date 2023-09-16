import { View } from "react-native";
import JobsListView from "../../../components/JobsListView";
import { useEffect, useState } from "react";
import axios from "axios";
import { Job } from "../../../types/types";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import { SegmentedButtons } from "react-native-paper";

export default function Jobs() {
  const [currentJobs, setCurrentJobs] = useState<Job[]>([]);
  const [pastJobs, setPastJobs] = useState<Job[]>([]);
  const [currentView, setCurrentView] = useState<"current" | "past">("current");

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

      const isPastJob = (j: Job) =>
        j.status === "rejected" || j.status === "completed";

      setCurrentJobs(jobs.filter((j) => !isPastJob(j)));
      setPastJobs(jobs.filter(isPastJob));
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
      <SegmentedButtons
        value={currentView}
        onValueChange={(v) => setCurrentView(v as "current" | "past")}
        buttons={[
          {
            value: "current",
            label: "Current",
          },
          {
            value: "past",
            label: "Past",
          },
        ]}
      />
      <JobsListView
        jobs={currentView === "current" ? currentJobs : pastJobs}
        updateJobs={updateJobs}
      />
    </View>
  );
}
