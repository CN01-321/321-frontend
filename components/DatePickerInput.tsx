import { TextInput, useTheme } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useState } from "react";
import { Pressable } from "react-native";
import { toDDMMYYYY } from "../utils";

interface DatePickerInputProps {
  label?: string;
  date?: Date;
  updateDate: (date: Date) => void;
}

export function DatePickerInput({
  label,
  date,
  updateDate,
}: DatePickerInputProps) {
  const [visible, setVisible] = useState(false);
  const theme = useTheme();

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        <TextInput
          mode="outlined"
          editable={false}
          label={label}
          value={date ? `${toDDMMYYYY(date)} ${date.toLocaleTimeString()}` : ""}
          outlineColor={theme.colors.primary}
          left={
            <TextInput.Icon
              icon="calendar-outline"
              iconColor={theme.colors.primary}
            />
          }
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
