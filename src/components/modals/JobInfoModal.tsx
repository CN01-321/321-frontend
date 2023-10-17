/**
 * @file Modal component for Job information
 * @author George Bull
 */

import { Button } from "react-native-paper";
import BaseOfferInfoModal, {
  BaseOfferInfoModalProps,
} from "./BaseOfferInfoModal";

interface JobInfoModalProps extends Omit<BaseOfferInfoModalProps, "children"> {
  onComplete: () => Promise<void>;
}
export default function JobInfoModal(props: JobInfoModalProps) {
  return (
    <BaseOfferInfoModal {...props}>
      {props.info.status !== "completed" ? (
        <Button mode="contained" onPress={props.onComplete}>
          Complete
        </Button>
      ) : null}
    </BaseOfferInfoModal>
  );
}
