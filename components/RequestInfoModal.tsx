import { Modal, Portal, Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { RequestInfo } from "../types";

interface RequestInfoModalProps {
  info: RequestInfo;
  visible: boolean;
  onDismiss: () => void;
}

export default function RequestInfoModal({
  info,
  visible,
  onDismiss,
}: RequestInfoModalProps) {
  const location = () =>
    `${info.location.street}, ${info.location.city}, ${info.location.state}`;

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss}>
        <View style={styles.container}>
          <Text variant="titleMedium" style={styles.details}>
            Details
          </Text>
          <View style={styles.textBlock}>
            <Text variant="bodyMedium">
              Start Date: {info.dateRange.startDate.toDateString()}
            </Text>
            <Text variant="bodyMedium">
              Start Time: {info.dateRange.startDate.toTimeString()}
            </Text>
          </View>

          <View style={styles.textBlock}>
            <Text variant="bodyMedium">
              End Date: {info.dateRange.endDate.toDateString()}
            </Text>
            <Text variant="bodyMedium">
              End Time: {info.dateRange.endDate.toTimeString()}
            </Text>
          </View>

          <View style={styles.textBlock}>
            <Text variant="bodyMedium">Location: {location()}</Text>
          </View>

          <View style={styles.textBlock}>
            <Text variant="bodyMedium">
              {/* TODO switch to pets page */}
              Pets: {info.pets.map((p) => p.name).join(", ")}
            </Text>
          </View>

          <View style={styles.textBlock}>
            <Text variant="bodyMedium">
              Additional Info: {info.additionalInfo}
            </Text>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 5,
  },
  details: {
    padding: 10,
    fontSize: 30,
    textAlign: "center",
  },
  textBlock: {
    padding: 10,
  },
});
