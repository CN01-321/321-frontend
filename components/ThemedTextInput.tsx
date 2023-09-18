import { TextInput, useTheme } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";

interface ThemedTextInputProps {
  label: string;
  icon?: IconSource;
  value?: string;
  onChangeText?: (s: string) => void;
  multiline?: boolean;
  editable?: boolean;
}

export default function ThemedTextInput({
  label,
  icon,
  value,
  onChangeText,
  multiline,
  editable,
}: ThemedTextInputProps) {
  const theme = useTheme();

  return (
    <TextInput
      label={label}
      mode="outlined"
      value={value}
      onChangeText={onChangeText}
      outlineColor={theme.colors.primary}
      multiline={multiline ?? false}
      editable={editable ?? true}
      outlineStyle={{
        borderRadius: 14,
      }}
      left={
        icon ? (
          <TextInput.Icon icon={icon} iconColor={theme.colors.primary} />
        ) : null
      }
      style={{
        backgroundColor: "white",
      }}
    />
  );
}
