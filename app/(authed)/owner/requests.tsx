import { useEffect, useState } from "react";
import { FlatList, GestureResponderEvent, View } from "react-native";
import { Avatar, Button, Card, FAB, Text } from "react-native-paper";
import { StyleSheet } from "react-native";
import NewRequestModal from "../../../components/NewRequestModal";
import { Stack, useRouter } from "expo-router";
import ShowModalFab from "../../../components/ShowModalFab";
import { Request } from "../../../types";
import axios from "axios";
import RequestInfoModal from "../../../components/RequestInfoModal";
import RequestCard from "../../../components/RequestCard";
import Header from "../../../components/Header";
import { useIsFocused } from "@react-navigation/native";

const icon = require("../../../assets/icon.png");

export default function Requests() {
  const [requests, setRequests] = useState<Array<Request>>([]);
  const [visible, setVisible] = useState(false);

  // isFocused is used to reload the requests in case a new request has been
  // made from the search page
  const isFocused = useIsFocused();

  useEffect((): (() => void) => {
    // do nothing if not focused
    if (!isFocused) return () => {};

    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<Array<Request>>("/owners/requests");

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

        if (!ignore) {
          setRequests(reqs);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => (ignore = true);
  }, [isFocused]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <>
      <Header title="Requests" />
      <View>
        <NewRequestModal visible={visible} onDismiss={hideModal} />
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
