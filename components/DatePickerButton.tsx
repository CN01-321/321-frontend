import { Button, Text } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { PropsWithChildren, useState } from "react";

interface DatePickerButtonProps {
  label?: string;
  date?: Date | null;
  updateDate: (date: Date) => void;
}

export function DatePickerButton({
  label,
  date,
  updateDate,
}: DatePickerButtonProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {label && <Text>{label}</Text>}
      <Button
        mode={date ? "contained" : "outlined"}
        onPress={() => setVisible(true)}
      >
        {date ? date.toDateString() : "Set Date"}
      </Button>
      <DateTimePickerModal
        isVisible={visible}
        mode="date"
        onConfirm={updateDate}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}
