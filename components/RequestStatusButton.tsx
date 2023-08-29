import { Button, useTheme } from "react-native-paper";
import {
  COMPLETED_COLOUR,
  ERROR_COLOUR,
  RequestStatus,
  SUCCESS_COLOUR,
} from "../types";

export default function RequestStatusButton({
  statusType,
}: {
  statusType: RequestStatus;
}) {
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
