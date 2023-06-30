import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Image, FlatList, StyleSheet } from "react-native";
import { Avatar, Button, Card, Modal, Portal, Text } from "react-native-paper";
import CarerResultsView, {
  CarerResult,
} from "../../../components/CarerResultsView";

const icon = require("../../../assets/icon.png");

const respondentData: Array<CarerResult> = [
  {
    id: "0",
    name: "Carer 1",
    rating: 4,
    message: "I am an enthusiastic pet carer",
    icon: "../../assets/icon.png",
  },
  {
    id: "1",
    name: "Carer 2",
    rating: 2,
    message: "I am an enthusiastic pet carer",
    icon: "../../assets/icon.png",
  },
  {
    id: "2",
    name: "Carer 3",
    rating: 5,
    message: "I am an enthusiastic pet carer",
    icon: "../../assets/icon.png",
  },
];

export default function Respondents() {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const [respondents, setRespondents] = useState<Array<CarerResult>>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setRespondents(respondentData);
  }, []);

  return (
    <View>
      <PaymentModal visible={visible} onDismiss={() => setVisible(false)} />
      <Text>Respondents {requestId}</Text>
      <CarerResultsView
        carerResults={respondents}
        handleRequest={(carerResult) => {
          setVisible(true);
        }}
        cardButtonLabel="Request Carer's Services"
      />
    </View>
  );
}

interface PaymentModalProps {
  visible: boolean;
  onDismiss: () => void;
}

function PaymentModal({ visible, onDismiss }: PaymentModalProps) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        style={styles.paymentModal}
      >
        <Button mode="contained" onPress={onDismiss}>
          Pay for service
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
