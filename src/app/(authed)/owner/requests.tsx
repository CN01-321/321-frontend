import { useEffect, useState } from "react";
import NewRequestModal from "../../../components/modals/NewRequestModal";
import ShowModalFab from "../../../components/ShowModalFab";
import { Request } from "../../../types/types";
import { useIsFocused } from "@react-navigation/native";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import ThemedTabView from "../../../components/views/ThemedTabView";
import { isPastRequest } from "../../../utilities/utils";
import { fetchRequestInfo } from "../../../utilities/fetch";
import RequestListView from "../../../components/views/RequestListView";
import Header from "../../../components/Header";

export default function Requests() {
  const [currentRequests, setCurrentRequests] = useState<Request[]>([]);
  const [pastRequests, setPastRequests] = useState<Request[]>([]);
  const [visible, setVisible] = useState(false);
  const { pushError } = useMessageSnackbar();

  const isFocused = useIsFocused();

  const updateRequests = async () => {
    try {
      const reqs = await fetchRequestInfo<Request>("/owners/requests");

      setCurrentRequests(reqs.filter((r) => !isPastRequest(r)));
      setPastRequests(reqs.filter(isPastRequest));
    } catch (e) {
      console.error(e);
      pushError("Could not fetch requests");
    }
  };

  useEffect(() => {
    if (!isFocused) return;

    updateRequests();
  }, [isFocused]);

  const currentRequestsScene = () => (
    <RequestListView
      requests={currentRequests}
      emptyTitle="No Current Requests"
      emptySubtitle="New requests will appear here"
    />
  );

  const pastRequestsScene = () => (
    <RequestListView
      requests={pastRequests}
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
      <Header title="Requests" />
      <ThemedTabView scenes={scenes} />
      <NewRequestModal
        title="New Request"
        visible={visible}
        onDismiss={() => setVisible(false)}
        updateRequests={updateRequests}
      />
      <ShowModalFab icon="plus" showModal={() => setVisible(true)} />
    </>
  );
}
