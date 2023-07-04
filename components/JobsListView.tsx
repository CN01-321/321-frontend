import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { Avatar, Button, Card, Portal, Text, Modal } from "react-native-paper";

const icon = require("../assets/icon.png");

export interface Job {
  jobId: string;
  ownerId: string;
  ownerName: string;
  ownerIcon?: string;
  pets: Array<{
    petId: string;
    petName: string;
    petType: "dog" | "cat" | "bird" | "rabbit";
  }>;
  requestedDate: Date;
  distance: number;
  startDate: Date;
  endDate: Date;
  location: string;
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
        keyExtractor={(item) => item.jobId}
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
            {job.pets.map((p) => p.petName).join(", ")} - {job.ownerName}
          </Text>
          <Text variant="bodyLarge">
            {job.pets.map((p) => p.petType).join(", ")}
          </Text>
          <Text variant="bodySmall">
            Requested on {job.requestedDate.toISOString()}
          </Text>
          <Text variant="bodySmall">Distance {job.distance}km</Text>
          <Link href={{ pathname: "profile", params: { userId: job.ownerId } }}>
            View Owner's Profile
          </Link>
          <Link href={{ pathname: "profile", params: { userId: job.ownerId } }}>
            View Pets's Profile?
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
  const handleAccept = () => {
    console.log("Accepted/applied", job);
    onDismiss();
  };

  const handleReject = () => {
    console.log("Rejected", job);
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: "white" }}
      >
        <Text variant="titleMedium">View Offer's Details</Text>
        <Text variant="bodyMedium">
          Start Date: {job.startDate.toISOString()}
        </Text>
        <Text variant="bodyMedium">End Date: {job.endDate.toISOString()}</Text>
        <Text variant="bodyMedium">Location: {job.location}</Text>
        <Text variant="bodyMedium">
          {/* TODO switch to pets page */}
          Pets:{" "}
          {job.pets.map((p) => (
            <Text key={p.petId}>
              <Link
                href={{
                  pathname: "profile",
                  params: { userId: job.ownerId },
                }}
              >
                {p.petName}
              </Link>{" "}
            </Text>
          ))}
        </Text>
        <Text variant="bodySmall">{job.additionalInfo}</Text>
        {jobType !== "job" && (
          <Button mode="contained" onPress={handleAccept}>
            {jobType === "direct" ? "Accept" : "Apply"}
          </Button>
        )}
        {jobType === "broad" && (
          <Button mode="contained" onPress={handleReject}>
            Reject
          </Button>
        )}
      </Modal>
    </Portal>
  );
}
