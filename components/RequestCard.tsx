import {
  Avatar,
  Button,
  Card,
  Text,
  useTheme,
  withTheme,
} from "react-native-paper";
import {
  COMPLETED_COLOUR,
  ERROR_COLOUR,
  Job,
  JobType,
  Request,
  RequestInfo,
  RequestStatus,
  SUCCESS_COLOUR,
  UserType,
} from "../types";
import { useState } from "react";
import RequestInfoModal from "./RequestInfoModal";
import { GestureResponderEvent, View, StyleSheet, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { Profile } from "./ReviewsView";

const icon = require("../assets/icon.png");

interface OwnerRequestCardProps {
  req: Request;
}

interface CarerRequestCardProps {
  job: Job;
  jobType: JobType;
  updateOffers: () => Promise<void>;
}

type RequestCardProps = OwnerRequestCardProps | CarerRequestCardProps;

function sinceRequested(date: Date) {
  const diff = new Date().getTime() - date.getTime();

  // if diff less than a minute ago show "now"
  const mins = Math.floor(diff / (1000 * 60));
  // <= 0 to catch minor time variations between backend on new requests
  if (mins <= 0) {
    return "now";
  }

  // if the diff less than an hour ago show "mins ago"
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (Math.floor(diff / (1000 * 60 * 60)) === 0) {
    return `${mins} min${mins === 1 ? "" : "s"} ago`;
  }

  // if less than a day show "hours ago"
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  return `${days} day${days === 1 ? "" : "s"} ago`;
}

// if jobType is not presesnt the is assumed to be Request, otherwise if it is
// then the req is a Job
export default function RequestCard(props: RequestCardProps) {
  const [visible, setVisible] = useState(false);

  const showMoreInfo = () => setVisible(true);
  const hideMoreInfo = () => setVisible(false);

  const isOwnerProps = (p: RequestCardProps): p is OwnerRequestCardProps => {
    return "req" in p;
  };

  const cardInfo = () => {
    if (isOwnerProps(props)) {
      return <RequestCardInfo req={props.req} />;
    }
    // else is carer card props
    const { job, jobType, updateOffers } = props;
    return (
      <JobCardInfo job={job} jobType={jobType} updateOffers={updateOffers} />
    );
  };

  const reqInfo = () => {
    return isOwnerProps(props) ? props.req : props.job;
  };

  return (
    <Card onPress={showMoreInfo} style={styles.requestCard}>
      <View style={styles.requestCardContainer}>
        <Image
          style={styles.requestImage}
          source={reqInfo().pfp ? { uri: reqInfo().pfp } : icon}
        />
        {cardInfo()}
      </View>
      <RequestInfoModal
        info={reqInfo()}
        visible={visible}
        onDismiss={hideMoreInfo}
      />
    </Card>
  );
}

function RequestCardInfo({ req }: { req: Request }) {
  const router = useRouter();

  const handleViewRespondents = (e: GestureResponderEvent) => {
    e.stopPropagation();
    router.push({
      pathname: "/owner/respondents",
      params: { requestId: req._id },
    });
  };

  const isPendingBroadRequest = !req.carer && req.status === "pending";
  const viewRespondents = (
    <Button mode="contained" onPress={handleViewRespondents}>
      View Respondents
    </Button>
  );

  console.log("request is ", req);

  return (
    <View style={styles.requestInfo}>
      <Text variant="titleLarge">{req.pets.map((p) => p.name).join(", ")}</Text>
      <Text>{req.carer ? req.carer?.name : "Pending"}</Text>
      <Text variant="bodySmall">{`Requested ${sinceRequested(
        req.requestedOn
      )}`}</Text>
      {isPendingBroadRequest ? (
        viewRespondents
      ) : (
        <RequestStatusButton statusType={req.status} />
      )}
    </View>
  );
}

interface JobCardInfoProps {
  job: Job;
  jobType: JobType;
  updateOffers: () => Promise<void>;
}

function JobCardInfo({ job, jobType, updateOffers }: JobCardInfoProps) {
  const handleAccept = async (e: GestureResponderEvent) => {
    // prevent tapping the accept button from also opening more info
    e.stopPropagation();
    console.log("Accepted/applied", job);
    try {
      await axios.post(`/carers/${jobType}/${job._id}/accept`);
      await updateOffers();
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
      await updateOffers();
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
    // <View style={styles.requestInfo}>
    //   <Text variant="titleLarge">
    //     {job.pets.map((p) => p.name).join(", ")} - {job.ownerName}
    //   </Text>
    //   <Text variant="bodyLarge">
    //     {job.pets.map((p) => p.petType).join(", ")}
    //   </Text>
    //   <Text variant="bodySmall">
    //     Requested on {job.requestedOn.toISOString()}
    //   </Text>
    //   <Text variant="bodySmall">City {job.location.city}</Text>
    //   <Link href={{ pathname: "profile", params: { userId: job.ownerId } }}>
    //     View Owner's Profile
    //   </Link>
    //   {jobType !== "job" && job.status !== "applied" && (
    //     <>
    //       <Button mode="contained" onPress={handleAccept}>
    //         {jobType === "direct" ? "Accept" : "Apply"}
    //       </Button>
    //       <Button mode="contained" onPress={handleReject}>
    //         Reject
    //       </Button>
    //     </>
    //   )}
    // </View>
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

function RequestStatusButton({ statusType }: { statusType: RequestStatus }) {
  const theme = useTheme();

  const getStatus = () => {
    console.log(statusType);

    switch (statusType) {
      case "pending":
        return { name: "Pending", colour: theme.colors.primary };
      case "applied":
        return { name: "Applied", colour: theme.colors.primary };
      case "accepted":
        return { name: "Accepted", colour: SUCCESS_COLOUR };
      case "rejected":
        return { name: "Rejected", colour: ERROR_COLOUR };
      case "completed":
        return { name: "Rejected", colour: COMPLETED_COLOUR };
    }
  };

  return (
    <Button
      mode="outlined"
      style={{ borderColor: getStatus().colour }}
      textColor={getStatus().colour}
    >
      {getStatus().name}
    </Button>
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
