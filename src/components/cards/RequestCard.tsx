import { Button, Text } from "react-native-paper";
import BaseRequestCard from "./BaseRequestCard";
import { Request } from "../../types/types";
import { sinceRequested } from "../../utilities/utils";
import RequestStatusText from "../RequestStatusText";
import { useRouter } from "expo-router";

const paws = require("../../../assets/icons/pet/ownerPaws.png");

interface RequestCardProps {
  request: Request;
}
export default function RequestCard({ request }: RequestCardProps) {
  const router = useRouter();

  const randPetPfp = () => {
    const pfps = request.pets.filter((p) => p.pfp).map((p) => p.pfp);
    return pfps[0];
  };

  const cardTitle = request.pets.map((p) => p.name).join(", ");
  const carerName = `Carer: ${request.carer ? request.carer.name : "Pending"}`;
  const requestedOn = `Requested ${sinceRequested(request.requestedOn)}`;

  const handleViewRespondents = () => {
    router.push({
      pathname: "/owner/respondents",
      params: { requestId: request._id },
    });
  };

  return (
    <BaseRequestCard
      title={cardTitle}
      name={carerName}
      pfp={randPetPfp()}
      paw={paws}
    >
      <Text variant="bodySmall" style={{ fontWeight: "600" }}>
        {requestedOn}
      </Text>
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
