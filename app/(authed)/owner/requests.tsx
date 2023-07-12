import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Avatar, Button, Card, FAB, Text } from "react-native-paper";
import { StyleSheet, Image } from "react-native";
import NewRequestModal from "../../../components/NewRequestModal";
import { useRouter } from "expo-router";
import ShowModalFab from "../../../components/ShowModalFab";
import axios from "axios";

const icon = require("../../../assets/icon.png");

interface Request {
  _id: string;
  carer?: {
    _id: string;
    name: string;
  };
  location: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  requestedOn: Date;
  isComplete: boolean;
}

const requestsData: Array<Request> = [
  {
    _id: "0",
    requestedOn: new Date(),
    location: "Wollongong, NSW",
    dateRange: {
      startDate: new Date(),
      endDate: new Date(Date() + 60 * 60 * 60 * 24),
    },
    isComplete: false,
  },
  {
    _id: "1",
    requestedOn: new Date(),
    carer: {
      _id: "0",
      name: "Carer Name",
    },
    location: "Wollongong, NSW",
    dateRange: {
      startDate: new Date(),
      endDate: new Date(Date() + 60 * 60 * 60 * 24),
    },
    isComplete: true,
  },
  {
    _id: "2",
    requestedOn: new Date(),
    location: "Wollongong, NSW",
    dateRange: {
      startDate: new Date(),
      endDate: new Date(Date() + 60 * 60 * 60 * 24),
    },
    isComplete: false,
  },
  {
    _id: "3",
    requestedOn: new Date(),
    carer: {
      _id: "0",
      name: "Carer Name",
    },
    location: "Wollongong, NSW",
    dateRange: {
      startDate: new Date(),
      endDate: new Date(Date() + 60 * 60 * 60 * 24),
    },
    isComplete: true,
  },
  {
    _id: "4",
    requestedOn: new Date(),
    location: "Wollongong, NSW",
    dateRange: {
      startDate: new Date(),
      endDate: new Date(Date() + 60 * 60 * 60 * 24),
    },
    isComplete: false,
  },
  {
    _id: "5",
    requestedOn: new Date(),
    carer: {
      _id: "0",
      name: "Carer Name",
    },
    location: "Wollongong, NSW",
    dateRange: {
      startDate: new Date(),
      endDate: new Date(Date() + 60 * 60 * 60 * 24),
    },
    isComplete: true,
  },
];

export default function Requests() {
  const [requests, setRequests] = useState<Array<Request>>([]);
  const [visible, setVisible] = useState(false);

  useEffect((): (() => void) => {
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
          console.log(reqs);
          setRequests(reqs);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => (ignore = true);
  }, []);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View>
      <NewRequestModal visible={visible} onDismiss={hideModal} />
      <FlatList
        data={requests}
        renderItem={({ item }) => <RequestCard req={item} />}
        keyExtractor={(item) => item._id}
      />
      <ShowModalFab icon="plus" showModal={showModal} />
    </View>
  );
}

function RequestCard({ req }: { req: Request }) {
  return (
    <Card>
      <Card.Content style={styles.broadRequestCard}>
        <Avatar.Image source={icon} size={100} />
        <RequestCardInfo req={req} />
      </Card.Content>
    </Card>
  );
}

function RequestCardInfo({ req }: { req: Request }) {
  const router = useRouter();

  const handleViewRespondents = () => {
    router.push({
      pathname: "/owner/respondents",
      params: { requestId: req._id },
    });
  };
  return (
    <View>
      <Text variant="titleMedium">
        {req.isComplete
          ? req.carer?.name
          : req.dateRange.startDate.toDateString()}
      </Text>
      <Text variant="bodySmall">
        {req.carer ? `Direct Request to ${req.carer.name}` : "Broad Request"}
      </Text>
      <Text variant="bodySmall">
        {req.isComplete ? "Completed" : "Pending"}
      </Text>
      {!req.isComplete ? (
        <Button onPress={handleViewRespondents}>
          View {req.carer ? "Response" : "Respondents"}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  broadRequestCard: {
    flexDirection: "row",
    padding: 5,
  },
});
