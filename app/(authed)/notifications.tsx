import {
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Avatar, Card, Divider, Text } from "react-native-paper";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { getPfpUrl } from "../../utils";

const icon = require("../../assets/icon.png");

type NotificationType =
  | "recievedDirect"
  | "recievedFeedback"
  | "acceptedDirect"
  | "acceptedBroad";

interface Notification {
  notificationType: NotificationType;
  subjectName: string;
  subjectPfp?: string;
  notifiedOn: Date;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<Notification[]>(
          "/users/notifications"
        );

        // set notifications as decending in time
        setNotifications(
          data
            .map((n) => {
              return { ...n, notifiedOn: new Date(n.notifiedOn) };
            })
            .sort((n1, n2) => n2.notifiedOn.getTime() - n1.notifiedOn.getTime())
        );
      } catch (err) {
        console.error(err);
      }
    })();

    return () => (ignore = true);
  }, []);

  return (
    <>
      <Header title="Notifications" />
      <ScrollView contentContainerStyle={styles.notificationContainer}>
        {notifications.map((notification, index) => (
          <NotificationCard notification={notification} key={index} />
        ))}
      </ScrollView>
    </>
  );
}

interface NotificationCardProps {
  notification: Notification;
}

function NotificationCard({ notification }: NotificationCardProps) {
  const userPfp: ImageSourcePropType = notification.subjectPfp
    ? { uri: getPfpUrl(notification.subjectPfp) }
    : icon;

  const getNotificationTitle = () => {
    switch (notification.notificationType) {
      case "recievedDirect":
        return "You Have a New Job Offer";
      case "recievedFeedback":
        return "You Have Some New Feedback";
      case "acceptedDirect":
        return "Your Request Has Been Accepted";
      case "acceptedBroad":
        return "You Have Been Accepted for a Job";
    }
  };

  const getNotificationSubject = () => {
    switch (notification.notificationType) {
      case "recievedDirect":
        return `${notification.subjectName} has offered you a job`;
      case "recievedFeedback":
        return `${notification.subjectName} has left some feedback`;
      case "acceptedDirect":
        return `${notification.subjectName} has accepted your request`;
      case "acceptedBroad":
        return `${notification.subjectName} has hired you for the job`;
    }
  };

  return (
    <Card>
      <Avatar.Image source={userPfp} />
      <Card.Content>
        <Text variant="titleSmall">{getNotificationTitle()}</Text>
        <Text variant="bodyMedium">{getNotificationSubject()}</Text>
        <Text variant="bodySmall">
          Notified On: {notification.notifiedOn.toISOString()}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  notificationContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
});
