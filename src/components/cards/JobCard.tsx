import { Button, Text } from "react-native-paper";
import { Job } from "../../types/types";
import BaseRequestCard from "./BaseRequestCard";
import { sinceRequested } from "../../utilities/utils";
import RequestStatusText from "../RequestStatusText";
import { useState } from "react";
import JobInfoModal from "../modals/JobInfoModal";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";
import { useOffers } from "../../contexts/offers";

const paw = require("../../../assets/icons/pet/carerPaws.png");

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const [visible, setVisible] = useState(false);
  const { pushError } = useMessageSnackbar();
  const { completeJob } = useOffers();

  const cardTitle = job.pets.map((p) => p.name).join(", ");
  const whenRequested = () => `Requested ${sinceRequested(job.requestedOn)}`;

  const handleComplete = async () => {
    try {
      await completeJob(job);
    } catch (err) {
      console.error(err);
      pushError("Could not complete job");
    }

    setVisible(false);
  };

  return (
    <BaseRequestCard
      title={cardTitle}
      name={`Owner: ${job.ownerName}`}
      pfp={job.ownerIcon}
      onPress={() => setVisible(true)}
      paw={paw}
    >
      <Text variant="bodyMedium">{whenRequested()}</Text>
      <Text variant="bodyMedium">
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
