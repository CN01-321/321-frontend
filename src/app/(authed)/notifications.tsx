import { ScrollView, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import DynamicAvatar from "../../components/DynamicAvatar";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";
import { fetchNotifications } from "../../utilities/fetch";

type NotificationType =
  | "recievedDirect"
  | "recievedFeedback"
  | "acceptedDirect"
  | "acceptedBroad";

export interface Notification {
  notificationType: NotificationType;
  subjectName: string;
  subjectPfp?: string;
  notifiedOn: Date;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { pushError } = useMessageSnackbar();

  useEffect(() => {
    (async () => {
      try {
        setNotifications(await fetchNotifications());
      } catch (err) {
        console.error(err);
        pushError("Could not fetch notifications");
      }
    })();
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
      <DynamicAvatar pfp={notification.subjectPfp} defaultPfp="user" />
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
