import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import axios from "axios";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import PaymentModal from "../../../components/modals/PaymentModal";
import { Respondent } from "../../../types/types";
import RespondentCard from "../../../components/cards/RespondentCard";

export default function Respondents() {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const [currentRespondent, setCurrentRespondent] = useState<Respondent>();
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [visible, setVisible] = useState(false);
  const { pushMessage, pushError } = useMessageSnackbar();
  const router = useRouter();

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<Respondent[]>(
          `/owners/requests/${requestId}/respondents`
        );

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
      <FlatList
        data={respondents}
        renderItem={({ item }) => (
          <RespondentCard
            respondent={item}
            onHire={() => {
              setCurrentRespondent(item);
              setVisible(true);
            }}
          />
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}
