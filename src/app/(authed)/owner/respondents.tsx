import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import axios from "axios";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import PaymentModal from "../../../components/modals/PaymentModal";
import { Respondent } from "../../../types/types";
import RespondentCard from "../../../components/cards/RespondentCard";
import { fetchData } from "../../../utilities/fetch";

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
