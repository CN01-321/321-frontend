import { useEffect, useState } from "react";
import { Job } from "../../../types/types";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import ThemedTabView from "../../../components/views/ThemedTabView";
import { isPastJob } from "../../../utilities/utils";
import { FlatList, StyleSheet } from "react-native";
import JobCard from "../../../components/cards/JobCard";
import { fetchRequestInfo } from "../../../utilities/fetch";

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
    <FlatList
      data={currentJobs}
      renderItem={({ item }) => <JobCard job={item} updateJobs={updateJobs} />}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.jobListContainer}
      onRefresh={updateJobs}
      refreshing={refreshing}
    />
  );

  const pastJobsScene = () => (
    <FlatList
      data={pastJobs}
      renderItem={({ item }) => <JobCard job={item} updateJobs={updateJobs} />}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.jobListContainer}
      onRefresh={updateJobs}
      refreshing={refreshing}
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

const styles = StyleSheet.create({
  jobListContainer: {
    paddingBottom: 100,
  },
});
