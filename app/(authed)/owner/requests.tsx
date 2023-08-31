import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import NewRequestModal from "../../../components/NewRequestModal";
import ShowModalFab from "../../../components/ShowModalFab";
import { Request } from "../../../types";
import axios from "axios";
import RequestCard from "../../../components/RequestCard";
import Header from "../../../components/Header";
import { useIsFocused } from "@react-navigation/native";

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [visible, setVisible] = useState(false);

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

      setRequests(reqs);
    } catch (e) {
      console.error(e);
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
          visible={visible}
          onDismiss={hideModal}
          updateRequests={updateRequests}
        />
        <FlatList
          data={requests}
          renderItem={({ item }) => <RequestCard req={item} />}
          keyExtractor={(item) => item._id}
        />
      </View>
      <ShowModalFab icon="plus" showModal={showModal} />
    </>
  );
}
