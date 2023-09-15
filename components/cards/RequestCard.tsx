import { Button, Text } from "react-native-paper";
import BaseRequestCard from "./BaseRequestCard";
import { Request } from "../../types";
import { sinceRequested } from "../../utils";
import RequestStatusText from "../RequestStatusText";
import { useRouter } from "expo-router";

const icon = require("../../assets/icon.png");

interface RequestCardProps {
  request: Request;
}
export default function RequestCard({ request }: RequestCardProps) {
  const router = useRouter();

  const randPetPfp = () => {
    const pfps = request.pets.filter((p) => p.pfp).map((p) => p.pfp);
    return pfps[0];
  };

  const cardTitle = () => request.pets.map((p) => p.name).join(", ");
  const requestedOn = `Requested ${sinceRequested(request.requestedOn)}`;

  const handleViewRespondents = () => {
    router.push({
      pathname: "/pets/request-pets",
      params: { requestId: request._id },
    });
  };

  return (
    <BaseRequestCard pfp={randPetPfp()} defaultPfp={icon}>
      <Text variant="titleLarge">{cardTitle()}</Text>
      <Text>{request.carer ? request.carer.name : "Pending"}</Text>
      <Text variant="bodySmall">{requestedOn}</Text>
      <Text variant="bodySmall">
        Status: <RequestStatusText status={request.status} />
      </Text>
      {!request.carer && request.status === "pending" ? (
        <Button mode="contained" onPress={handleViewRespondents}>
          View Respondents
        </Button>
      ) : null}
    </BaseRequestCard>
  );
}
