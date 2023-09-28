import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import axios from "axios";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import PaymentModal from "../../../components/modals/PaymentModal";
import { Respondent } from "../../../types/types";
import { fetchData } from "../../../utilities/fetch";
import RespondentListView from "../../../components/views/RespondentsListView";

export default function Respondents() {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const [currentRespondent, setCurrentRespondent] = useState<Respondent>();
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [visible, setVisible] = useState(false);
  const { pushMessage, pushError } = useMessageSnackbar();
  const router = useRouter();

  useEffect(() => {
    fetchData(`/owners/requests/${requestId}/respondents`, setRespondents, () =>
      pushError("Could not fetch respondents")
    );
  }, []);

  const handleAccept = async () => {
    try {
      await axios.post(
        `/owners/requests/${requestId}/respondents/${currentRespondent?._id}`
      );
      pushMessage("Your request has been successfully made!");
      setVisible(false);
      router.push("/owner/requests");
    } catch (err) {
      console.error(err);
      pushError("Could not accept respondent");
    }
  };

  return (
    <View>
      <Header title="Request Respondents" />
      <PaymentModal
        visible={visible}
        requestId={requestId ?? ""}
        onAccept={handleAccept}
        onDismiss={() => setVisible(false)}
        respondent={currentRespondent}
      />
      <RespondentListView
        respondents={respondents}
        onHire={(respondent) => {
          setCurrentRespondent(respondent);
          setVisible(true);
        }}
        emptyTitle="No Respondents"
        emptySubtitle="Come back later to check for new respondents"
      />
    </View>
  );
}
