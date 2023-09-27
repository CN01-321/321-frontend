import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import NewRequestModal from "../../../components/modals/NewRequestModal";
import ShowModalFab from "../../../components/ShowModalFab";
import { Request } from "../../../types/types";
import RequestCard from "../../../components/cards/RequestCard";
import { useIsFocused, useTheme } from "@react-navigation/native";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import ThemedTabView from "../../../components/views/ThemedTabView";
import { isPastRequest } from "../../../utilities/utils";
import { fetchRequestInfo } from "../../../utilities/fetch";

export default function Requests() {
  const [currentRequests, setCurrentRequests] = useState<Request[]>([]);
  const [pastRequests, setPastRequests] = useState<Request[]>([]);
  const [visible, setVisible] = useState(false);
  const { pushError } = useMessageSnackbar();
  const theme = useTheme();

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
      contentContainerStyle={{ backgroundColor: theme.colors.background }}
    />
  );

  const scenes = [
    { key: "current", title: "Current", scene: currentRequestsScene },
    { key: "past", title: "Past", scene: pastRequestsScene },
  ];

  return (
    <>
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
