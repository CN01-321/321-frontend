import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import NewRequestModal from "../../../components/modals/NewRequestModal";
import ShowModalFab from "../../../components/ShowModalFab";
import { Request } from "../../../types/types";
import RequestCard from "../../../components/cards/RequestCard";
import Header from "../../../components/Header";
import { useIsFocused, useTheme } from "@react-navigation/native";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import ThemedTabView from "../../../components/ThemedTabView";
import { fetchRequestInfo } from "../../../utils";

export default function Requests() {
  const [currentRequests, setCurrentRequests] = useState<Request[]>([]);
  const [pastRequests, setPastRequests] = useState<Request[]>([]);
  const [visible, setVisible] = useState(false);
  const { pushError } = useMessageSnackbar();
  const theme = useTheme();

  // isFocused is used to reload the requests in case a new request has been
  // made from the search page
  const isFocused = useIsFocused();

  const updateRequests = async () => {
    try {
      const reqs = await fetchRequestInfo<Request>("/owners/requests");

      const isPastRequest = (r: Request) =>
        r.status === "rejected" || r.status === "completed";

      setCurrentRequests(reqs.filter((r) => !isPastRequest(r)));
      setPastRequests(reqs.filter(isPastRequest));
    } catch (e) {
      console.error(e);
      pushError("Could not fetch requests");
    }
  };

  useEffect(() => {
    console.log(`is focused: ${isFocused}`);

    // do nothing if not focused
    if (!isFocused) return () => {};

    updateRequests();
  }, [isFocused]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const currentRequestsScene = () => (
    <FlatList
      data={currentRequests}
      renderItem={({ item }) => <RequestCard request={item} />}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ backgroundColor: theme.colors.background }}
    />
  );

  const pastRequestsScene = () => (
    <FlatList
      data={pastRequests}
      renderItem={({ item }) => <RequestCard request={item} />}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ backgroundColor: theme.colors.primary }}
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
        onDismiss={hideModal}
        updateRequests={updateRequests}
      />
      <ShowModalFab icon="plus" showModal={showModal} />
    </>
  );
}
