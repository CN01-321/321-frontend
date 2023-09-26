import { View } from "react-native";
import BaseOfferInfoModal, {
  BaseOfferInfoModalProps,
} from "./BaseOfferInfoModal";
import { Text, Button, Dialog, Portal, useTheme } from "react-native-paper";
import { useState } from "react";
import { OfferType } from "../../types/types";

interface OfferInfoModalProps
  extends Omit<BaseOfferInfoModalProps, "children"> {
  offerType: OfferType;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
}

export default function OfferInfoModal({
  info,
  title,
  visible,
  onDismiss,
  offerType,
  onAccept,
  onReject,
}: OfferInfoModalProps) {
  const [rejDialogVisible, setRejDialogVisible] = useState(false);
  const theme = useTheme();

  return (
    <BaseOfferInfoModal
      info={info}
      title={title}
      visible={visible}
      onDismiss={onDismiss}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          mode="outlined"
          style={{ flexBasis: 150, borderColor: theme.colors.primary }}
          onPress={() => setRejDialogVisible(true)}
        >
          Reject
        </Button>
        <RejectConfirmationDialog
          visible={rejDialogVisible}
          onDismiss={() => setRejDialogVisible(false)}
          onReject={onReject}
        />
        <Button mode="contained" onPress={onAccept} style={{ flexBasis: 150 }}>
          {offerType === "direct" ? "Accept" : "Apply"}
        </Button>
      </View>
    </BaseOfferInfoModal>
  );
}

interface RejectConfirmationDialogProps {
  visible: boolean;
  onReject: () => Promise<void>;
  onDismiss: () => void;
}

function RejectConfirmationDialog({
  visible,
  onReject,
  onDismiss,
}: RejectConfirmationDialogProps) {
  const theme = useTheme();

  const handleCancel = () => {
    onDismiss();
  };

  const handleReject = async () => {
    await onReject();
    onDismiss();
  };

  return (
    <Portal>
      <Dialog
        style={{ backgroundColor: "white" }}
        visible={visible}
        onDismiss={handleCancel}
      >
        <Dialog.Title>Reject Job Offer</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodySmall">
            Are you sure you want to reject this offer? If you reject it, it
            will be permanently removed.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="text" textColor="#777777" onPress={onDismiss}>
            Cancel
          </Button>
          <Button
            mode="text"
            textColor={theme.colors.error}
            onPress={handleReject}
          >
            Reject Offer
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
