import { Button, Card, Text } from "react-native-paper";
import { Job, JobType } from "../types";
import { useState } from "react";
import RequestInfoModal from "./RequestInfoModal";
import { GestureResponderEvent, View, StyleSheet } from "react-native";
import axios from "axios";
import { sinceRequested } from "../utils";
import DynamicCardCover from "./DynamicCardCover";
import RequestStatusButton from "./RequestStatusButton";

const icon = require("../assets/icon.png");

interface OfferCardProps {
  job: Job;
  jobType: JobType;
  updateOffers?: () => Promise<void>;
}

export default function OfferCard({
  job,
  jobType,
  updateOffers,
}: OfferCardProps) {
  const [visible, setVisible] = useState(false);

  const showMoreInfo = () => setVisible(true);
  const hideMoreInfo = () => setVisible(false);

  return (
    <Card onPress={showMoreInfo} style={styles.requestCard}>
      <View style={styles.requestCardContainer}>
        <DynamicCardCover
          imageId={job.ownerIcon}
          defaultImage={icon}
          style={{ width: "30%" }}
        />
        <JobCardInfo job={job} jobType={jobType} updateOffers={updateOffers} />
      </View>
      <RequestInfoModal info={job} visible={visible} onDismiss={hideMoreInfo} />
    </Card>
  );
}

interface JobCardInfoProps {
  job: Job;
  jobType: JobType;
  updateOffers?: () => Promise<void>;
}

function JobCardInfo({ job, jobType, updateOffers }: JobCardInfoProps) {
  const handleAccept = async (e: GestureResponderEvent) => {
    // prevent tapping the accept button from also opening more info
    e.stopPropagation();
    console.log("Accepted/applied", job);
    try {
      await axios.post(`/carers/${jobType}/${job._id}/accept`);
      if (updateOffers) await updateOffers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (e: GestureResponderEvent) => {
    // prevent tapping the reject button from also opening more info
    e.stopPropagation();
    console.log("Rejected", job);
    try {
      await axios.post(`/carers/${jobType}/${job._id}/reject`);
      if (updateOffers) await updateOffers();
    } catch (e) {
      console.error(e);
    }
  };

  const showStatusButtons = () => {
    if (jobType === "broad" && job.status !== "applied") {
      return (
        <Button mode="contained" onPress={handleAccept}>
          Apply
        </Button>
      );
    }

    if (jobType === "direct") {
      return (
        <>
          <Button mode="contained" onPress={handleAccept}>
            Accept
          </Button>
          <Button mode="outlined" onPress={handleReject}>
            Reject
          </Button>
        </>
      );
    }

    return <RequestStatusButton statusType={job.status} />;
  };

  return (
    <View style={styles.requestInfo}>
      <Text variant="titleLarge">{job.pets.map((p) => p.name).join(", ")}</Text>
      <Text>{job.ownerName}</Text>
      <Text variant="bodySmall">{`Requested ${sinceRequested(
        job.requestedOn
      )}`}</Text>
      {showStatusButtons()}
    </View>
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
    // flexWrap: "nowrap",
    // alignItems: "flex-start",
    // paddingBottom: 30,
    minheight: 200,
    // textAlign: "center",
    // padding: 15,
    // marginLeft: 300,
  },
  requestImage: {
    // alignSelf: "flex-end",
    width: "30%",
    height: "100%",
    // resizeMode: "stretch",
  },
  requestInfo: {
    paddingLeft: 10,
    paddingBottom: 10,
    width: "65%",
  },
});
