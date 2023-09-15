import { Button, Text } from "react-native-paper";
import { Job } from "../../types";
import BaseRequestCard from "./BaseRequestCard";
import { sinceRequested } from "../../utils";
import RequestStatusText from "../RequestStatusText";
import { useState } from "react";
import JobInfoModal from "../modals/JobInfoModal";
import axios from "axios";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";

const icon = require("../../assets/icon.png");

interface JobCardProps {
  job: Job;
  updateJobs: () => Promise<void>;
}

export default function JobCard({ job, updateJobs }: JobCardProps) {
  const [visible, setVisible] = useState(false);
  const { pushMessage, pushError } = useMessageSnackbar();

  const cardTitle = () => job.pets.map((p) => p.name).join(", ");
  const whenRequested = () => `Requested ${sinceRequested(job.requestedOn)}`;

  const handleComplete = async () => {
    try {
      await axios.post(`/carers/jobs/${job._id}/complete`);
      await updateJobs();
      pushMessage("Successfully completed job!");
    } catch (err) {
      console.error(err);
      pushError("Could not complete job");
    }

    setVisible(false);
  };

  return (
    <BaseRequestCard
      pfp={job.ownerIcon}
      defaultPfp={icon}
      onPress={() => setVisible(true)}
    >
      <Text variant="titleLarge">{cardTitle()}</Text>
      <Text variant="bodyMedium">{job.ownerName}</Text>
      <Text variant="bodySmall">{whenRequested()}</Text>
      <Text variant="bodySmall">
        Status: <RequestStatusText status={job.status} />
      </Text>
      <Button mode="contained">View Details</Button>
      <JobInfoModal
        title="Job's Details"
        info={job}
        visible={visible}
        onDismiss={() => setVisible(false)}
        onComplete={handleComplete}
      />
    </BaseRequestCard>
  );
}
