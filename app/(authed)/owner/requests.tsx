import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Avatar, Button, Card, FAB, Text } from "react-native-paper";
import { StyleSheet, Image } from "react-native";
import NewRequestModal from "../../../components/NewRequestModal";
import { useRouter } from "expo-router";
import ShowModalFab from "../../../components/ShowModalFab";

const icon = require("../../../assets/icon.png");

interface BroadRequest {
  id: number;
  reqDate: Date;
  carerName?: string;
  location: string;
  postedDate: Date;
  pricePerHour: number;
  complete: boolean;
}

const broadRequests: Array<BroadRequest> = [
  {
    id: 0,
    reqDate: new Date(),
    location: "Wollongong, NSW",
    postedDate: new Date(),
    pricePerHour: 20.0,
    complete: false,
  },
  {
    id: 1,
    reqDate: new Date(),
    carerName: "Carer Name",
    location: "Wollongong, NSW",
    postedDate: new Date(),
    pricePerHour: 20.0,
    complete: true,
  },
  {
    id: 2,
    reqDate: new Date(),
    location: "Wollongong, NSW",
    postedDate: new Date(),
    pricePerHour: 20.0,
    complete: false,
  },
  {
    id: 3,
    reqDate: new Date(),
    carerName: "Carer Name",
    location: "Wollongong, NSW",
    postedDate: new Date(),
    pricePerHour: 20.0,
    complete: true,
  },
  {
    id: 4,
    reqDate: new Date(),
    location: "Wollongong, NSW",
    postedDate: new Date(),
    pricePerHour: 20.0,
    complete: false,
  },
  {
    id: 5,
    reqDate: new Date(),
    carerName: "Carer Name",
    location: "Wollongong, NSW",
    postedDate: new Date(),
    pricePerHour: 20.0,
    complete: true,
  },
];

export default function BroadRequests() {
  const [requests, setRequests] = useState<Array<BroadRequest>>([]);
  const [visible, setVisible] = useState(false);

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      if (!ignore) {
        setRequests(broadRequests);
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
        renderItem={({ item }) => <BroadRequestCard req={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
      <ShowModalFab icon="plus" showModal={showModal} />
    </View>
  );
}

function BroadRequestCard({ req }: { req: BroadRequest }) {
  return (
    <Card>
      <Card.Content style={styles.broadRequestCard}>
        <Avatar.Image source={icon} size={100} />
        <BroadRequestCardInfo req={req} />
      </Card.Content>
    </Card>
  );
}

function BroadRequestCardInfo({ req }: { req: BroadRequest }) {
  const router = useRouter();

  const handleViewRespondents = () => {
    router.push({
      pathname: "/owner/respondents",
      params: { requestId: req.id },
    });
  };
  return (
    <View>
      <Text variant="titleMedium">
        {req.complete ? req.carerName : req.reqDate.toDateString()}
      </Text>
      <Text variant="bodySmall">{req.location}</Text>
      <Text variant="bodySmall">
        {req.complete ? "completed" : `Price: $${req.pricePerHour}/hr`}
      </Text>
      {!req.complete ? (
        <Button onPress={handleViewRespondents}>View Respondents</Button>
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
