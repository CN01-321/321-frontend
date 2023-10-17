/**
 * @file Component that handles selecting date and time
 * @author George Bull
 */

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useState } from "react";
import { Pressable } from "react-native";
import { toDDMMYYYY } from "../utilities/utils";
import ThemedTextInput from "./ThemedTextInput";

interface DatePickerInputProps {
  label: string;
  date?: Date;
  updateDate: (date: Date) => void;
}

export function DatePickerInput({
  label,
  date,
  updateDate,
}: DatePickerInputProps) {
  const [visible, setVisible] = useState(false);

  const handleDismiss = () => setVisible(false);

  return (
    <Pressable onPress={() => setVisible(true)}>
      <ThemedTextInput
        editable={false}
        label={label}
        value={date ? `${toDDMMYYYY(date)} ${date.toLocaleTimeString()}` : ""}
        icon="calendar-outline"
      />
      <DateTimePickerModal
        isVisible={visible}
        mode="datetime"
        onConfirm={updateDate}
        onCancel={handleDismiss}
        onHide={handleDismiss}
      />
    </Pressable>
  );
}
