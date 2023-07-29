import { StyleSheet, View } from "react-native";
import { Avatar, Divider, Text } from "react-native-paper";
import { Stack } from "expo-router";
import Header from "../../components/Header";

type Notification = {
  name: string;
  description: string;
};

const exampleNotifications: Array<Notification> = [
  {
    name: "Person 1",
    description: "has accepted your hiring request.",
  },
  {
    name: "Person 2",
    description: "has commented on your profile.",
  },
  {
    name: "Person 3",
    description: "has fulfilled your request.",
  },
];

export default function Notifications() {
  return (
    <>
      <Header title="Search" />
      <View>
        {exampleNotifications.map((notification, index) => (
          <View key={index}>
            <View style={styles.notificationContainer}>
              <Avatar.Text label="P" />
              <Text>{`${notification.name} ${notification.description}`}</Text>
            </View>
            <Divider />
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  notificationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10.0,
    paddingTop: 10.0,
    paddingBottom: 10.0,
    paddingLeft: 5.0,
    paddingRight: 5.0,
  },
});
