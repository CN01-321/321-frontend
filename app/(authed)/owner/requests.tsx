import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import NewRequestModal from "../../../components/modals/NewRequestModal";
import ShowModalFab from "../../../components/ShowModalFab";
import { Request } from "../../../types/types";
import axios from "axios";
import RequestCard from "../../../components/cards/RequestCard";
import Header from "../../../components/Header";
import { useIsFocused } from "@react-navigation/native";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import { SegmentedButtons } from "react-native-paper";

export default function Requests() {
  const [currentRequests, setCurrentRequests] = useState<Request[]>([]);
  const [pastRequests, setPastRequests] = useState<Request[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentView, setCurrentView] = useState<"current" | "past">("current");
  const { pushError } = useMessageSnackbar();

  // isFocused is used to reload the requests in case a new request has been
  // made from the search page
  const isFocused = useIsFocused();

  const updateRequests = async () => {
    try {
      const { data } = await axios.get<Request[]>("/owners/requests");

      // turn all date strings into date objects
      const reqs = data.map((r) => {
        return {
          ...r,
          requestedOn: new Date(r.requestedOn),
          dateRange: {
            startDate: new Date(r.dateRange.startDate),
            endDate: new Date(r.dateRange.endDate),
          },
        };
      });

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

  return (
    <>
      <Header title="Requests" />
      <View>
        <NewRequestModal
          title="New Request"
          visible={visible}
          onDismiss={hideModal}
          updateRequests={updateRequests}
        />
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
        <FlatList
          data={currentView === "current" ? currentRequests : pastRequests}
          renderItem={({ item }) => <RequestCard request={item} />}
          keyExtractor={(item) => item._id}
        />
      </View>
      <ShowModalFab icon="plus" showModal={showModal} />
    </>
  );
}
