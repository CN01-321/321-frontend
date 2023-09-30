import { StyleSheet } from "react-native";
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
      mode={props.mode ?? "outlined"}
      textColor="#505050"
      outlineColor={props.outlineColor ?? theme.colors.primary}
      outlineStyle={styles.box}
      contentStyle={styles.text}
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

const styles = StyleSheet.create({
  text: {
    fontFamily: "Montserrat-Medium",
    fontSize: 15,
  },
  box: {
    borderRadius: 14,
  },
});
