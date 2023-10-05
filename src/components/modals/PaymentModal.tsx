import { PropsWithChildren, useEffect, useState } from "react";
import { Pet, Request } from "../../types/types";
import BaseModal from "./BaseModal";
import axios from "axios";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";
import { StyleSheet, View } from "react-native";
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";
import {
  Text,
  IconButton,
  useTheme,
  Divider,
  Button,
  TextInput,
} from "react-native-paper";
import {
  calculateTotalCost,
  getDuration,
  locationToString,
  toDDMMYYYY,
} from "../../utilities/utils";
import { CarerResult } from "../../types/types";
import CheckboxSelectorCard from "../cards/CheckboxSelectorCard";

interface PaymentModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAccept: () => Promise<void>;
  requestId: string;
  respondent?: CarerResult;
}

export default function PaymentModal({
  visible,
  onDismiss,
  onAccept,
  requestId,
  respondent,
}: PaymentModalProps) {
  const [request, setRequest] = useState<Request>({
    _id: "",
    pets: [],
    requestedOn: new Date(),
    dateRange: { startDate: new Date(), endDate: new Date() },
    location: { street: "", city: "", state: "" },
    status: "pending",
  });
  const [pets, setPets] = useState<Pet[]>([]);
  const { pushError } = useMessageSnackbar();

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<Pet[]>(
          `/owners/requests/${requestId}/pets`
        );

        console.log("pets are: ", data);

        if (!ignore) setPets(data);
      } catch (err) {
        console.error(err);
        pushError("Could not fetch pets for payment information");
      }

      try {
        const { data } = await axios.get<Request>(
          `/owners/requests/${requestId}`
        );

        const req = {
          ...data,
          dateRange: {
            startDate: new Date(data.dateRange.startDate),
            endDate: new Date(data.dateRange.endDate),
          },
        };

        console.log(req, null, 2);

        if (!ignore) setRequest(req);
      } catch (err) {
        console.error(err);
        pushError("Could not fetch request for payment information");
      }
    })();

    return () => (ignore = true);
  }, []);

  return (
    <BaseModal title="Payment" visible={visible} onDismiss={onDismiss}>
      <View style={{ marginBottom: 200 }}>
        <Text variant="displaySmall" style={styles.sectionTextHeader}>
          SUMMARY OF THE JOB REQUEST
        </Text>
        <RequestItem icon="calendar-outline" title="Date">
          <Text variant="bodySmall">
            {toDDMMYYYY(request?.dateRange.startDate ?? new Date())}
          </Text>
        </RequestItem>

        <RequestItem icon="clock-outline" title="Time">
          <Text variant="bodySmall">
            {request?.dateRange.startDate.toTimeString()}
          </Text>
        </RequestItem>

        <RequestItem icon="timer-sand" title="Duration">
          <Text variant="bodySmall">
            {getDuration(
              request.dateRange.startDate,
              request.dateRange.endDate
            )}
          </Text>
        </RequestItem>

        <RequestItem icon="crosshairs-gps" title="Location">
          <Text variant="bodySmall">{locationToString(request.location)}</Text>
        </RequestItem>

        {request.carer ? (
          <RequestItem icon="account-outline" title="Carer's Name">
            <Text variant="bodySmall">
              {locationToString(request.location)}
            </Text>
          </RequestItem>
        ) : null}

        <View style={{ marginTop: -20, padding: 10 }}>
          <CheckboxSelectorCard
            title="Pets"
            icon="dog-side"
            items={pets}
            keyExtractor={(item) => item._id}
            nameExtractor={(item) => item.name}
          />
          <Divider />
        </View>

        <RequestItem icon="information" title="Additional Info">
          <Text variant="bodySmall">{request.additionalInfo}</Text>
        </RequestItem>

        <Text variant="displaySmall" style={styles.sectionTextHeader}>
          COST BREAKDOWN
        </Text>

        <RequestItem icon="cash-fast" title="Hourly Rate">
          <Text variant="bodySmall">$ {respondent?.hourlyRate ?? "0"}</Text>
        </RequestItem>

        <RequestItem icon="cash" title="Total Cost">
          <Text variant="bodySmall">
            ${" "}
            {calculateTotalCost(
              respondent?.hourlyRate ?? 1,
              request.dateRange.startDate,
              request.dateRange.endDate
            )}
          </Text>
        </RequestItem>

        <Text variant="displaySmall" style={styles.sectionTextHeader}>
          PAYMENT DETAILS
        </Text>

        <PaymentDetails />

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            style={styles.actionButton}
            mode="outlined"
            onPress={onDismiss}
          >
            Cancel
          </Button>
          <Button
            style={styles.actionButton}
            mode="contained"
            onPress={onAccept}
          >
            Pay now
          </Button>
        </View>
      </View>
    </BaseModal>
  );
}

interface RequestItemProps extends PropsWithChildren {
  icon: IconSource;
  title: string;
}

function RequestItem({ icon, title, children }: RequestItemProps) {
  const theme = useTheme();
  return (
    <View style={styles.requestItemContainer}>
      <View style={styles.requestItem}>
        <IconButton icon={icon} iconColor={theme.colors.primary} size={20} />
        <View>
          <Text variant="titleSmall">{title}</Text>
          {children}
        </View>
      </View>
      <Divider />
    </View>
  );
}

function PaymentDetails() {
  const theme = useTheme();
  return (
    <View style={{ paddingBottom: 20 }}>
      <TextInput
        mode="outlined"
        label="Card Number"
        outlineColor={theme.colors.primary}
        value="1234 5678 9123 4567"
        left={
          <TextInput.Icon
            icon="credit-card-outline"
            iconColor={theme.colors.primary}
          />
        }
      />
      <View
        style={{
          paddingVertical: 10,
          flex: 1,
          gap: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TextInput
          style={{ flexBasis: 230 }}
          mode="outlined"
          label="Expiration Date"
          outlineColor={theme.colors.primary}
          value="12/27"
          left={
            <TextInput.Icon
              icon="credit-card-outline"
              iconColor={theme.colors.primary}
            />
          }
        />
        <TextInput
          style={{ flexGrow: 1 }}
          mode="outlined"
          label="CVV"
          outlineColor={theme.colors.primary}
          value="***"
          left={
            <TextInput.Icon
              icon="credit-card-outline"
              iconColor={theme.colors.primary}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTextHeader: {
    fontSize: 12,
    color: "#888888",
    paddingLeft: 10,
  },
  requestItemContainer: {
    padding: 10,
    width: "90%",
  },
  requestItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  petItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  actionButton: {
    width: 150,
  },
});
