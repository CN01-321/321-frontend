/**
 * @file Route for showing owners's requests
 * @author George Bull
 */

import { useState } from "react";
import NewRequestModal from "../../../components/modals/NewRequestModal";
import ShowModalFab from "../../../components/ShowModalFab";
import ThemedTabView from "../../../components/views/ThemedTabView";
import RequestListView from "../../../components/views/RequestListView";
import Header from "../../../components/Header";
import { useRequests } from "../../../contexts/requests";

export default function Requests() {
  const [visible, setVisible] = useState(false);
  const { getCurrentRequests, getPastRequests } = useRequests();

  const currentRequestsScene = () => (
    <RequestListView
      requests={getCurrentRequests()}
      emptyTitle="No Current Requests"
      emptySubtitle="New requests will appear here"
    />
  );

  const pastRequestsScene = () => (
    <RequestListView
      requests={getPastRequests()}
      emptyTitle="No Past Requests"
      emptySubtitle="Completed/rejected requests will appear here"
    />
  );

  const scenes = [
    { key: "current", title: "Current", scene: currentRequestsScene },
    { key: "past", title: "Past", scene: pastRequestsScene },
  ];

  return (
    <>
      <Header showLogo showButtons title="Requests" />
      <ThemedTabView scenes={scenes} />
      <NewRequestModal
        title="New Request"
        visible={visible}
        onDismiss={() => setVisible(false)}
      />
      <ShowModalFab icon="plus" showModal={() => setVisible(true)} />
    </>
  );
}
