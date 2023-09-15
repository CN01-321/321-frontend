import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Job } from "../../types/types";
import BaseModal, { BaseModalProps } from "./BaseModal";
import { Link } from "expo-router";
import { getDuration, locationToString } from "../../utils";
import RequestStatusText from "../RequestStatusText";

export interface BaseOfferInfoModalProps extends BaseModalProps {
  info: Job;
}

export default function BaseOfferInfoModal({
  info,
  title,
  visible,
  onDismiss,
  children,
}: BaseOfferInfoModalProps) {
  return (
    <BaseModal title={title} visible={visible} onDismiss={onDismiss}>
      <View style={styles.container}>
        <Text variant="bodySmall">
          Status: <RequestStatusText status={info.status} />
        </Text>
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
          <Text variant="bodyMedium">
            Duration:{" "}
            {getDuration(info.dateRange.startDate, info.dateRange.endDate)}
          </Text>
        </View>

        <View style={styles.textBlock}>
          <Text variant="bodyMedium">
            Location: {locationToString(info.location)}
          </Text>
        </View>

        <View style={styles.textBlock}>
          <Text variant="bodyMedium">Owner: {info.ownerName}</Text>
          <Link
            href={{
              pathname: "/profile/overview",
              params: { profileId: info.ownerId },
            }}
            onPress={onDismiss}
          >
            Tap Here to View Profile
          </Link>
        </View>

        <View style={styles.textBlock}>
          <Text variant="bodyMedium">
            {/* TODO switch to pets page */}
            Pets: {info.pets.map((p) => p.name).join(", ")}
          </Text>
        </View>

        {info.additionalInfo ? (
          <View style={styles.textBlock}>
            <Text variant="bodyMedium">
              Additional Info: {info.additionalInfo}
            </Text>
          </View>
        ) : null}
        {children}
      </View>
    </BaseModal>
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
