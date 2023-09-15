import { View } from "react-native";
import BaseOfferInfoModal, {
  BaseOfferInfoModalProps,
} from "./BaseOfferInfoModal";
import { Button, Dialog, Portal } from "react-native-paper";
import { useState } from "react";

interface OfferInfoModalProps
  extends Omit<BaseOfferInfoModalProps, "children"> {
  offerType: "direct" | "broad";
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

  return (
    <BaseOfferInfoModal
      info={info}
      title={title}
      visible={visible}
      onDismiss={onDismiss}
    >
      <View>
        <Button mode="outlined">Reject</Button>
        <RejectConfirmationDialog
          visible={rejDialogVisible}
          onDismiss={() => setRejDialogVisible(false)}
          onReject={onReject}
        />
        <Button mode="contained" onPress={onAccept}>
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
  const handleCancel = () => {
    onDismiss();
  };

  const handleReject = async () => {
    await onReject();
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleCancel}>
        <Dialog.Title>Reject Job Offer</Dialog.Title>
        <Dialog.Content>
          Are you sure you want to reject this offer? If you reject it, it will
          be permanently removed.
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="text" onPress={handleReject}>
            Reject Offer
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "white",
//     padding: 30,
//     borderRadius: 5,
//   },
//   details: {
//     padding: 10,
//     fontSize: 30,
//     textAlign: "center",
//   },
//   textBlock: {
//     padding: 10,
//   },
// });
