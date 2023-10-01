import Header from "../../../components/Header";
import ThemedTabView from "../../../components/views/ThemedTabView";
import JobListView from "../../../components/views/JobListView";
import { useOffers } from "../../../contexts/offers";

export default function Jobs() {
  const { getCurrentJobs, getPastJobs } = useOffers();

  const currentJobsScene = () => (
    <JobListView
      jobs={getCurrentJobs()}
      emptyTitle="No Current Jobs"
      emptySubtitle="Accept some offers for them to appear here"
    />
  );

  const pastJobsScene = () => (
    <JobListView
      jobs={getPastJobs()}
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
