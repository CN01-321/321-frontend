/**
 * @file Base modal component that each offer modal can inherit from
 * @author George Bull
 */

import { View, StyleSheet, Pressable } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { Job } from "../../types/types";
import BaseModal, { BaseModalProps } from "./BaseModal";
import { useRouter } from "expo-router";
import { getDuration, locationToString } from "../../utilities/utils";
import RequestStatusText from "../RequestStatusText";
import { PropsWithChildren } from "react";
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";

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
  const theme = useTheme();
  const router = useRouter();

  const routeToOwner = () => {
    onDismiss();
    router.push({
      pathname: "/profile/overview",
      params: { profileId: info.ownerId },
    });
  };

  const routeToRequestPets = () => {
    onDismiss();
    router.push({
      pathname: "/pets/request-pets",
      params: { requestId: info._id },
    });
  };

  return (
    <BaseModal title={title} visible={visible} onDismiss={onDismiss}>
      <Text variant="bodySmall" style={{ textAlign: "center" }}>
        Status: <RequestStatusText status={info.status} />
      </Text>

      <InfoItem icon="calendar-outline" title="Date">
        <Text variant="bodyMedium">
          Start Date: {info.dateRange.startDate.toDateString()}
        </Text>
      </InfoItem>

      <InfoItem icon="clock-outline" title="Time">
        <Text variant="bodyMedium">
          Start Time: {info.dateRange.startDate.toTimeString()}
        </Text>
      </InfoItem>

      <InfoItem icon="timer-sand" title="Duration">
        <Text variant="bodyMedium">
          {getDuration(info.dateRange.startDate, info.dateRange.endDate)}
        </Text>
      </InfoItem>

      <InfoItem icon="crosshairs-gps" title="Location">
        <Text variant="bodyMedium">{locationToString(info.location)}</Text>
      </InfoItem>

      <InfoItem icon="account-outline" title="Owner">
        <Pressable onPress={routeToOwner}>
          <Text variant="titleSmall" style={{ color: theme.colors.primary }}>
            {info.ownerName}
          </Text>
          <Text variant="bodySmall">Tap here to view profile</Text>
        </Pressable>
      </InfoItem>

      <InfoItem icon="dog-side" title="Pets">
        <Pressable onPress={routeToRequestPets}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            {info.pets.map((p) => (
              <Text
                key={p._id}
                variant="titleSmall"
                style={{ color: theme.colors.primary }}
              >
                - {p.name}
              </Text>
            ))}
          </View>
          <Text variant="bodySmall">Tap here to view pet profiles</Text>
        </Pressable>
      </InfoItem>

      {info.additionalInfo ? (
        <InfoItem icon="information-variant" title="Additional Info">
          <Text variant="bodySmall">{info.additionalInfo}</Text>
        </InfoItem>
      ) : null}
      {children}
    </BaseModal>
  );
}

interface InfoItemProps extends PropsWithChildren {
  icon: IconSource;
  title: string;
}
function InfoItem({ icon, title, children }: InfoItemProps) {
  const theme = useTheme();
  return (
    <View style={styles.infoItemContainer}>
      <IconButton icon={icon} iconColor={theme.colors.primary} />
      <View>
        <Text variant="titleSmall">{title}</Text>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoItemContainer: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: "row",
  },
});
