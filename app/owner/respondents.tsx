import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Image, FlatList, StyleSheet } from "react-native";
import { Avatar, Button, Card, Modal, Portal, Text } from "react-native-paper";

const icon = require("../../assets/icon.png");

interface Respondent {
  id: string,
  name: string,
  rating: number,
  message: string
  price: number
  icon: string,
}

const respondentData: Array<Respondent> = [
  {
    id: "0",
    name: "Carer 1",
    rating: 4,
    message: "I am an enthusiastic pet carer",
    price: 20,
    icon: "../../assets/icon.png"
  },
  {
    id: "1",
    name: "Carer 2",
    rating: 2,
    message: "I am an enthusiastic pet carer",
    price: 30,
    icon: "../../assets/icon.png"
  },
  {
    id: "2",
    name: "Carer 3",
    rating: 5,
    message: "I am an enthusiastic pet carer",
    price: 15,
    icon: "../../assets/icon.png"
  },
];

export default function Respondents() {
  const {requestId} = useLocalSearchParams<{requestId: string}>();
  const [respondents, setRespondents] = useState<Array<Respondent>>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setRespondents(respondentData);
  }, [])
  
  return (
    <View>
      <PaymentModal visible={visible} onDismiss={() => setVisible(false)} />
      <Text>Respondents {requestId}</Text>
      <FlatList 
        data={respondents}
        renderItem={({item}) => <RespondentCard respondent={item} handleRequest={() => setVisible(true)} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

interface RespondentCardProps {
  respondent: Respondent
  handleRequest: () => void
}

function RespondentCard({ respondent, handleRequest }: RespondentCardProps) {
  return (
    <Card>
      <Card.Content style={styles.respondentCard}>
        <Avatar.Image source={icon} />
        <RespondentCardInfo respondent={respondent} handleRequest={handleRequest} />
      </Card.Content>
    </Card>
  );
}

function RespondentCardInfo({ respondent, handleRequest }: RespondentCardProps) {
  return (
    <View>
      <Text variant="titleMedium">{respondent.name}</Text>
      <StarRating stars={respondent.rating} />
      <Text variant="bodySmall">{respondent.message}</Text>
      <Button mode="contained" onPress={handleRequest}>
        Request Carer's Services
      </Button>
    </View>
  );
}

// not sure how else to do this
function StarRating({stars}: {stars: number}) {
  const star = <Avatar.Icon icon={"star"} size={20} />;

  return (
    <View style={styles.starRating}>
      {stars > 0 && star}
      {stars > 1 && star}
      {stars > 2 && star}
      {stars > 3 && star}
      {stars > 4 && star}
    </View>
  );
}

interface PaymentModalProps {
  visible: boolean,
  onDismiss: () => void,
}

function PaymentModal({visible, onDismiss}: PaymentModalProps) {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} style={styles.paymentModal}>
        <Button mode="contained" onPress={onDismiss}>Pay for service</Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  respondentCard: {
    flexDirection: "row",
    padding: 5
  },
  starRating: {
    flexDirection: "row"
  },
  paymentModal: {
    backgroundColor: "white"
  }
});
