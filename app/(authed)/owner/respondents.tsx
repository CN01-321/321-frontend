import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import CarerResultsView, {
  CarerResult,
} from "../../../components/CarerResultsView";
import axios from "axios";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import PaymentModal from "../../../components/modals/PaymentModal";

export default function Respondents() {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const [respodentId, setRespondentId] = useState("");
  const [respondents, setRespondents] = useState<CarerResult[]>([]);
  const [visible, setVisible] = useState(false);
  const { pushMessage, pushError } = useMessageSnackbar();
  const router = useRouter();

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<CarerResult[]>(
          `/owners/requests/${requestId}/respondents`
        );

        console.log(JSON.stringify(data, null, 2));

        if (!ignore) {
          setRespondents(data);
        }
      } catch (e) {
        console.error(e);
        pushError("Could not fetch respondents");
      }
    })();

    return () => (ignore = true);
  }, []);

  const handleAccept = async () => {
    try {
      await axios.post(
        `/owners/requests/${requestId}/respondents/${respodentId}`
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
        respondent={respondents.find((r) => r._id === respodentId)}
      />
      <CarerResultsView
        carerResults={respondents}
        handleRequest={(carerResult) => {
          setRespondentId(carerResult._id);
          setVisible(true);
        }}
        cardButtonLabel="Hire"
      />
    </View>
  );
}
