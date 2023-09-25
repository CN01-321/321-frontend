import { Button, Text } from "react-native-paper";
import { Job } from "../../types/types";
import BaseRequestCard from "./BaseRequestCard";
import { sinceRequested } from "../../utils";
import RequestStatusText from "../RequestStatusText";

const icon = require("../../assets/icon.png");
const paw = require("../../assets/icons/pet/carerPaws.png");

interface OfferCardProps {
  offer: Job;
  onSelect: () => void;
}

export default function OfferCard({ offer, onSelect }: OfferCardProps) {
  const cardTitle = offer.pets.map((p) => p.name).join(", ");
  const whenRequested = () => `Requested ${sinceRequested(offer.requestedOn)}`;

  return (
    <BaseRequestCard
      title={cardTitle}
      name={offer.ownerName}
      pfp={offer.ownerIcon}
      defaultPfp={icon}
      onPress={onSelect}
      paw={paw}
    >
      <Text variant="bodyMedium">{whenRequested()}</Text>
      <Text variant="bodyMedium">
        Status: <RequestStatusText status={offer.status} />
      </Text>
      <Button mode="contained">View Details</Button>
    </BaseRequestCard>
  );
}
