import axios from "axios";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { Avatar, Button, Card, Portal, Text, Modal } from "react-native-paper";

const icon = require("../assets/icon.png");

export interface Job {
  _id: string;
  ownerId: string;
  ownerName: string;
  ownerIcon?: string;
  pets: Array<{
    _id: string;
    name: string;
    petType: "dog" | "cat" | "bird" | "rabbit";
  }>;
  requestedOn: Date;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  location: {
    state: string;
    city: string;
    street: string;
    lat: number;
    lng: number;
  };
  additionalInfo: string;
}

type JobType = "direct" | "broad" | "job";

interface JobsListViewProps {
  jobs: Array<Job>;
  jobType: JobType;
}

export default function JobsListView({ jobs, jobType }: JobsListViewProps) {
  return (
    <View>
      <FlatList
        data={jobs}
        renderItem={({ item }) => <JobCard job={item} jobType={jobType} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

interface JobCardProps {
  job: Job;
  jobType: JobType;
}

function JobCard({ job, jobType }: JobCardProps) {
  return (
    <Card>
      <Card.Content>
        {/* TODO switch up for owner icon if present */}
        <Avatar.Image source={icon} size={40} />
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
          <JobDetailsButton job={job} jobType={jobType} />
        </View>
      </Card.Content>
    </Card>
  );
}

interface JobDetailsButtonProps {
  job: Job;
  jobType: JobType;
}

function JobDetailsButton({ job, jobType }: JobDetailsButtonProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button mode="contained" onPress={() => setVisible(true)}>
        View Details
      </Button>
      <JobDetailsModal
        job={job}
        jobType={jobType}
        visible={visible}
        onDismiss={() => setVisible(false)}
      />
    </>
  );
}

interface JobDetailsModalProps {
  job: Job;
  jobType: JobType;
  visible: boolean;
  onDismiss: () => void;
}

function JobDetailsModal({
  job,
  jobType,
  visible,
  onDismiss,
}: JobDetailsModalProps) {
  const router = useRouter();

  const handleAccept = async () => {
    console.log("Accepted/applied", job);
    try {
      await axios.post(`/carers/${jobType}/${job._id}/accept`);
    } catch (e) {
      console.error(e);
    }
    onDismiss();
    router.replace({
      pathname: "/carer/offers",
      params: { initOfferType: jobType },
    });
  };

  const handleReject = async () => {
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
    onDismiss();
  };

  const location = () =>
    `${job.location.street}, ${job.location.city}, ${job.location.state}`;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: "white" }}
      >
        <Text variant="titleMedium">View Offer's Details</Text>
        <Text variant="bodyMedium">
          Start Date: {job.dateRange.startDate.toISOString()}
        </Text>
        <Text variant="bodyMedium">
          End Date: {job.dateRange.endDate.toISOString()}
        </Text>
        <Text variant="bodyMedium">Location: {location()}</Text>
        <Text variant="bodyMedium">
          {/* TODO switch to pets page */}
          Pets:{" "}
          {job.pets.map((p) => (
            <Text key={p._id}>
              <Link
                href={{
                  pathname: "profile",
                  params: { userId: job.ownerId },
                }}
              >
                {p.name}
              </Link>{" "}
            </Text>
          ))}
        </Text>
        <Text variant="bodySmall">{job.additionalInfo}</Text>
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
      </Modal>
    </Portal>
  );
}
