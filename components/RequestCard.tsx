import { Button, Card, Text } from "react-native-paper";
import { Request } from "../types";
import { useState } from "react";
import RequestInfoModal from "./RequestInfoModal";
import { GestureResponderEvent, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { sinceRequested } from "../utils";
import DynamicCardCover from "./DynamicCardCover";
import RequestStatusButton from "./RequestStatusButton";

const icon = require("../assets/icon.png");

interface RequestCardProps {
  req: Request;
}

// if jobType is not presesnt the is assumed to be Request, otherwise if it is
// then the req is a Job
export default function RequestCard({ req }: RequestCardProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const showMoreInfo = () => setVisible(true);
  const hideMoreInfo = () => setVisible(false);

  const randPetPfp = () => {
    const pfps = req.pets.filter((p) => p.pfp).map((p) => p.pfp);
    return pfps[0];
  };

  const handleViewRespondents = (e: GestureResponderEvent) => {
    e.stopPropagation();
    router.push({
      pathname: "/owner/respondents",
      params: { requestId: req._id },
    });
  };

  const statusButton =
    !req.carer && req.status === "pending" ? (
      <Button mode="contained" onPress={handleViewRespondents}>
        View Respondents
      </Button>
    ) : (
      <RequestStatusButton statusType={req.status} />
    );

  const requestedOn = `Requested ${sinceRequested(req.requestedOn)}`;

  return (
    <Card onPress={showMoreInfo} style={styles.requestCard}>
      <View style={styles.requestCardContainer}>
        <DynamicCardCover
          imageId={randPetPfp()}
          defaultImage={icon}
          style={{ width: "30%" }}
        />
        <View style={styles.requestInfo}>
          <Text variant="titleLarge">
            {req.pets.map((p) => p.name).join(", ")}
          </Text>
          <Text>{req.carer ? req.carer.name : "Pending"}</Text>
          <Text variant="bodySmall">{requestedOn}</Text>
          {statusButton}
        </View>
      </View>
      <RequestInfoModal info={req} visible={visible} onDismiss={hideMoreInfo} />
    </Card>
  );
}

const styles = StyleSheet.create({
  requestCard: {
    overflow: "hidden",
    marginHorizontal: 15,
    marginVertical: 15,
  },
  requestCardContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    minheight: 200,
  },
  requestImage: {
    width: "30%",
    height: "100%",
  },
  requestInfo: {
    paddingLeft: 10,
    paddingBottom: 10,
    width: "65%",
  },
});
