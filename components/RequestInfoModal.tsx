import { Modal, Portal, Text } from "react-native-paper";
import { RequestInfo } from "../types";

interface RequestInfoModalProps {
  info: RequestInfo;
  visible: boolean;
  onDismiss: () => void;
}

export default function RequestInfoModal({
  info,
  visible,
  onDismiss,
}: RequestInfoModalProps) {
  const location = () =>
    `${info.location.street}, ${info.location.city}, ${info.location.state}`;

  console.log(info);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: "white" }}
      >
        <Text variant="titleMedium">Details</Text>
        <Text variant="bodyMedium">
          Start Date: {info.dateRange.startDate.toISOString()}
        </Text>
        <Text variant="bodyMedium">
          End Date: {info.dateRange.endDate.toISOString()}
        </Text>
        <Text variant="bodyMedium">Location: {location()}</Text>
        <Text variant="bodyMedium">
          {/* TODO switch to pets page */}
          Pets:{" "}
          {info.pets.map((p) => (
            <Text key={p._id}>
              {/* <Link
                href={{
                  pathname: "profile",
                  params: { userId: job.ownerId },
                }}
              >
                {p.name}
              </Link>{" "} */}
              {p.name}
            </Text>
          ))}
        </Text>
        <Text variant="bodySmall">{info.additionalInfo}</Text>
      </Modal>
    </Portal>
  );
}
