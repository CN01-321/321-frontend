/**
 * @file Route to a user's notifications
 * @author George Bull
 */

import { SectionList, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import DynamicAvatar from "../../components/DynamicAvatar";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";
import { fetchNotifications } from "../../utilities/fetch";
import {
  getNotificationSubject,
  getNotificationTitle,
  sortNotifications,
} from "../../utilities/utils";

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

export interface NotifTimeBucket {
  title: string;
  data: Notification[];
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotifTimeBucket[]>([]);
  const { pushError } = useMessageSnackbar();
  const theme = useTheme();

  const getNotifications = async () => {
    try {
      const notifs = await fetchNotifications();
      const buckets = await sortNotifications(notifs);
      setNotifications(buckets);
    } catch (err) {
      console.error(err);
      pushError("Could not fetch notifications");
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Header title="Notifications" />
      <SectionList
        contentContainerStyle={styles.notificationContainer}
        sections={notifications}
        renderItem={({ item }) => <NotificationCard notification={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            variant="titleMedium"
            style={{ paddingVertical: 5, color: theme.colors.primary }}
          >
            {title}
          </Text>
        )}
      />
    </View>
  );
}

interface NotificationCardProps {
  notification: Notification;
}

function NotificationCard({ notification }: NotificationCardProps) {
  const title = getNotificationTitle(notification);
  const subject = getNotificationSubject(notification);

  return (
    <View
      style={{
        flex: 1,
        margin: 5,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
      }}
    >
      <DynamicAvatar
        pfp={notification.subjectPfp}
        defaultPfp="user"
        size={40}
      />
      <View>
        <Text variant="titleSmall">{title}</Text>
        <Text variant="bodyMedium" style={{ color: "#777777" }}>
          {subject}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notificationContainer: {
    padding: 20,
    gap: 10,
  },
});
