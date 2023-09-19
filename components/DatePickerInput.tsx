import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useState } from "react";
import { Pressable } from "react-native";
import { toDDMMYYYY } from "../utils";
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

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        <ThemedTextInput
          editable={false}
          label={label}
          value={date ? `${toDDMMYYYY(date)} ${date.toLocaleTimeString()}` : ""}
          icon="calendar-outline"
        />
      </Pressable>
      <DateTimePickerModal
        isVisible={visible}
        mode="datetime"
        onConfirm={updateDate}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}
