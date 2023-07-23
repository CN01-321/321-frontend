import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import CarerResultsView, {
  CarerResult,
} from "../../../components/CarerResultsView";
import axios from "axios";

const icon = require("../../../assets/icon.png");

export default function Respondents() {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const [respodentId, setRespondentId] = useState("");
  const [respondents, setRespondents] = useState<Array<CarerResult>>([]);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<Array<CarerResult>>(
          `/owners/requests/${requestId}/respondents`
        );

        if (!ignore) {
          setRespondents(data);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => (ignore = true);
  }, []);

  const handleDismiss: (accepted: boolean) => void = (accepted) => {
    setVisible(false);

    // if the owner has hired the carer, redirect them to the requests page as
    // there is no need for them in this page any more
    if (accepted) {
      console.log("accepted carer");
      router.replace("/owner/requests");
    }
  };

  return (
    <View>
      <PaymentModal
        visible={visible}
        onDismiss={handleDismiss}
        requestId={requestId!}
        respondentId={respodentId}
      />
      <Text>Respondents {requestId}</Text>
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

interface PaymentModalProps {
  visible: boolean;
  onDismiss: (accepted: boolean) => void;
  requestId: string;
  respondentId: string;
}

function PaymentModal({
  visible,
  onDismiss,
  requestId,
  respondentId,
}: PaymentModalProps) {
  const handleAccept = async () => {
    try {
      await axios.post(
        `/owners/requests/${requestId}/respondents/${respondentId}`
      );
      onDismiss(true);
    } catch (e) {
      console.error(e);
      onDismiss(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => onDismiss(false)}
        style={styles.paymentModal}
      >
        <Button mode="contained" onPress={handleAccept}>
          Accept carer
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  respondentCard: {
    flexDirection: "row",
    padding: 5,
  },
  starRating: {
    flexDirection: "row",
  },
  paymentModal: {
    backgroundColor: "white",
  },
});
