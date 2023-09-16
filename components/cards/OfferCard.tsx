import { Button, Text } from "react-native-paper";
import { Job } from "../../types/types";
import BaseRequestCard from "./BaseRequestCard";
import { sinceRequested } from "../../utils";
import RequestStatusText from "../RequestStatusText";
import OfferInfoModal from "../modals/OfferInfoModal";
import { useState } from "react";
import axios from "axios";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";

const icon = require("../../assets/icon.png");

interface OfferCardProps {
  offer: Job;
  offerType: "direct" | "broad";
  updateOffers: () => Promise<void>;
}

export default function OfferCard({
  offer,
  offerType,
  updateOffers,
}: OfferCardProps) {
  const [visible, setVisible] = useState(false);
  const { pushMessage, pushError } = useMessageSnackbar();

  const cardTitle = () => offer.pets.map((p) => p.name).join(", ");
  const whenRequested = () => `Requested ${sinceRequested(offer.requestedOn)}`;

  const handleAccept = async () => {
    try {
      await axios.post(`/carers/${offerType}/${offer._id}/accept`);
      if (updateOffers) await updateOffers();
      pushMessage(
        offerType === "direct"
          ? 'Offer has been succeessfully moved to "Jobs".'
          : `Successfully applied to ${offer.ownerName}'s request`
      );
    } catch (err) {
      console.error(err);
      pushError("Failed to accept offer");
    }

    setVisible(false);
  };

  const handleReject = async () => {
    try {
      await axios.post(`/carers/${offerType}/${offer._id}/reject`);
      if (updateOffers) await updateOffers();

      pushMessage("Offer has been succeessfully rejected.");
    } catch (err) {
      console.error(err);
      pushError("Failed to reject offer");
    }

    setVisible(false);
  };
  return (
    <BaseRequestCard
      pfp={offer.ownerIcon}
      defaultPfp={icon}
      onPress={() => setVisible(true)}
    >
      <Text variant="titleLarge">{cardTitle()}</Text>
      <Text variant="bodyMedium">{offer.ownerName}</Text>
      <Text variant="bodySmall">{whenRequested()}</Text>
      <Text variant="bodySmall">
        Status: <RequestStatusText status={offer.status} />
      </Text>
      <Button mode="contained">View Details</Button>
      <OfferInfoModal
        title="Offer Details"
        info={offer}
        offerType={offerType}
        visible={visible}
        onDismiss={() => setVisible(false)}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </BaseRequestCard>
  );
}
