import { TextInput, TextInputProps, useTheme } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";

interface ThemedTextInputProps extends TextInputProps {
  label: string;
  icon?: IconSource;
}

export default function ThemedTextInput({
  label,
  icon,
  style,
  ...props
}: ThemedTextInputProps) {
  const theme = useTheme();

  return (
    <TextInput
      {...props}
      label={label}
      mode="outlined"
      textColor="#505050"
      outlineColor={theme.colors.primary}
      outlineStyle={{
        borderRadius: 14,
      }}
      left={
        icon ? (
          <TextInput.Icon icon={icon} iconColor={theme.colors.primary} />
        ) : null
      }
      style={[
        style,
        {
          fontFamily: "Montserrat-Medium",
          fontSize: 15,
        },
      ]}
    />
  );
}
