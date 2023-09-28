import { useEffect, useState } from "react";
import { Job } from "../../../types/types";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import ThemedTabView from "../../../components/views/ThemedTabView";
import { isPastJob } from "../../../utilities/utils";
import { fetchRequestInfo } from "../../../utilities/fetch";
import JobListView from "../../../components/views/JobListView";

export default function Jobs() {
  const [currentJobs, setCurrentJobs] = useState<Job[]>([]);
  const [pastJobs, setPastJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { pushError } = useMessageSnackbar();

  const updateJobs = async () => {
    setRefreshing(true);
    try {
      const jobs = await fetchRequestInfo<Job>("/carers/jobs");

      setCurrentJobs(jobs.filter((j) => !isPastJob(j)));
      setPastJobs(jobs.filter(isPastJob));
    } catch (e) {
      console.error(e);
      pushError("Could not fetch Jobs");
    }

    setRefreshing(false);
  };

  useEffect(() => {
    updateJobs();
  }, []);

  const currentJobsScene = () => (
    <JobListView
      jobs={currentJobs}
      onRefresh={updateJobs}
      refreshing={refreshing}
      emptyTitle="No Current Jobs"
      emptySubtitle="Accept some offers for them to appear here"
    />
  );

  const pastJobsScene = () => (
    <JobListView
      jobs={pastJobs}
      onRefresh={updateJobs}
      refreshing={refreshing}
      emptyTitle="No Past Jobs"
      emptySubtitle="Complete some jobs for them to appear here"
    />
  );

  const scenes = [
    { key: "current", title: "Current", scene: currentJobsScene },
    { key: "past", title: "Past", scene: pastJobsScene },
  ];

  return (
    <>
      <Header title="Jobs" />
      <ThemedTabView scenes={scenes} />
    </>
  );
}
