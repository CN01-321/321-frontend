import { View, StyleSheet } from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";

type EditableTextboxProps = {
  label: string;
  value: string;
  multiline?: boolean;
  icon?: IconSource;
  onBlur?: (args: any) => void;
  onChangeText?: (args: any) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  outlineColor?: string;
  activeOutlineColor?: string;
}

const EditableTextbox = ({ 
  label, 
  value, 
  multiline,
  icon,
  onBlur, 
  onChangeText,
  secureTextEntry, 
  autoCapitalize,
  outlineColor,
  activeOutlineColor,
}: EditableTextboxProps) => {
  const theme = useTheme();

  return (
    <View style={{ marginBottom: 15 }}>
      <TextInput 
        contentStyle={styles.text}
        textColor="#505050"
        outlineColor={outlineColor ? outlineColor : theme.colors.primary}
        activeOutlineColor={activeOutlineColor ? activeOutlineColor : theme.colors.primary}
        outlineStyle={styles.box}
        mode="outlined"
        label={label}
        value={value}
        left={icon ? <TextInput.Icon icon={icon} /> : null}
        editable={true}
        multiline={multiline}
        onBlur={onBlur}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize ? autoCapitalize : "sentences"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Montserrat-Medium",
    fontSize: 15,
  },
  box: {
    backgroundColor: "transparent",
    borderRadius: 12,
  }
});

export default EditableTextbox;