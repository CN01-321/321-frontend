import { Text, useTheme } from "react-native-paper";
import {
  COMPLETED_COLOUR,
  ERROR_COLOUR,
  RequestStatus,
  SUCCESS_COLOUR,
} from "../types/types";

interface RequestStatusTextProps {
  status: RequestStatus;
}

export default function RequestStatusText({ status }: RequestStatusTextProps) {
  const theme = useTheme();

  const getStatus = () => {
    switch (status) {
      case "pending":
        return { name: "Pending", colour: theme.colors.primary };
      case "applied":
        return { name: "Applied", colour: SUCCESS_COLOUR };
      case "accepted":
        return { name: "Accepted", colour: SUCCESS_COLOUR };
      case "rejected":
        return { name: "Rejected", colour: ERROR_COLOUR };
      case "completed":
        return { name: "Completed", colour: COMPLETED_COLOUR };
    }
  };

  return (
    <Text variant="bodySmall" style={{ color: getStatus().colour }}>
      {getStatus().name}
    </Text>
  );
}
