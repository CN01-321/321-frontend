import { Avatar, Button, Card, Text } from "react-native-paper";
import { Job, JobType, Request, RequestInfo, UserType } from "../types";
import { useState } from "react";
import RequestInfoModal from "./RequestInfoModal";
import { GestureResponderEvent, View, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import axios from "axios";

const icon = require("../assets/icon.png");

interface RequestCardProps {
  req: Request | Job;
  jobType?: JobType;
}

// if jobType is not presesnt the is assumed to be Request, otherwise if it is
// then the req is a Job
export default function RequestCard({ req, jobType }: RequestCardProps) {
  const [visible, setVisible] = useState(false);

  const showMoreInfo = () => setVisible(true);
  const hideMoreInfo = () => setVisible(false);

  return (
    <Card onPress={showMoreInfo}>
      <Card.Content>
        <Avatar.Image source={req.pfp ? req.pfp : icon} />
        {jobType ? (
          <JobCardInfo job={req as Job} jobType={jobType!} />
        ) : (
          <RequestCardInfo req={req as Request} />
        )}
      </Card.Content>
      <RequestInfoModal info={req} visible={visible} onDismiss={hideMoreInfo} />
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

  const handleViewPets = (e: GestureResponderEvent) => {
    e.stopPropagation();
    router.push({
      pathname: "/pets/request-pets",
      params: { requestId: req._id },
    });
  };

  return (
    <View>
      <Text variant="titleMedium">
        {req.status == "completed"
          ? req.carer?.name
          : req.dateRange.startDate.toDateString()}
      </Text>
      <Text variant="bodySmall">
        {req.carer ? `Direct Request to ${req.carer.name}` : "Broad Request"}
      </Text>
      <Text variant="bodySmall">{req.status}</Text>
      {/* if request carer is not present and is still pending then is broad 
      request, should show respondents button */}
      {!req.carer && req.status == "pending" ? (
        <Button onPress={handleViewRespondents}>View Respondents</Button>
      ) : null}
      <Button onPress={handleViewPets}>View Pets</Button>
    </View>
  );
}

function JobCardInfo({ job, jobType }: { job: Job; jobType: JobType }) {
  const router = useRouter();

  const handleAccept = async (e: GestureResponderEvent) => {
    // prevent tapping the accept button from also opening more info
    e.stopPropagation();
    console.log("Accepted/applied", job);
    try {
      await axios.post(`/carers/${jobType}/${job._id}/accept`);
    } catch (e) {
      console.error(e);
    }
    router.replace({
      pathname: "/carer/offers",
      params: { initOfferType: jobType },
    });
  };

  const handleReject = async (e: GestureResponderEvent) => {
    // prevent tapping the reject button from also opening more info
    e.stopPropagation();
    console.log("Rejected", job);
    try {
      await axios.post(`/carers/${jobType}/${job._id}/reject`);
    } catch (e) {
      console.error(e);
    }
    router.replace({
      pathname: "/carer/offers",
      params: { initOfferType: jobType },
    });
  };

  return (
    <View>
      <Text variant="titleMedium">
        {job.pets.map((p) => p.name).join(", ")} - {job.ownerName}
      </Text>
      <Text variant="bodyLarge">
        {job.pets.map((p) => p.petType).join(", ")}
      </Text>
      <Text variant="bodySmall">
        Requested on {job.requestedOn.toISOString()}
      </Text>
      <Text variant="bodySmall">City {job.location.city}</Text>
      <Link href={{ pathname: "profile", params: { userId: job.ownerId } }}>
        View Owner's Profile
      </Link>
      {jobType !== "job" && (
        <>
          <Button mode="contained" onPress={handleAccept}>
            {jobType === "direct" ? "Accept" : "Apply"}
          </Button>
          <Button mode="contained" onPress={handleReject}>
            Reject
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  broadRequestCard: {
    flexDirection: "row",
    padding: 5,
  },
});
