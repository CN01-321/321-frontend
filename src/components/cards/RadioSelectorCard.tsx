import { View, StyleSheet } from "react-native";
import { Text, RadioButton, Divider, useTheme } from "react-native-paper";
import BaseFormCard, { BaseFormCardProps } from "./BaseFormCard";

interface RadioSelectorCardProps<T> extends BaseFormCardProps {
  items: T[];
  value: T;
  onItemSelect: (value: T) => void;
  keyExtractor: (item: T) => string;
  nameExtractor: (item: T) => string;
}
export default function RadioSelectorCard<T>({
  title,
  titleStyle,
  icon,
  border,
  items,
  value,
  onItemSelect,
  keyExtractor,
  nameExtractor,
}: RadioSelectorCardProps<T>) {
  return (
    <BaseFormCard
      title={title}
      titleStyle={titleStyle}
      icon={icon}
      border={border}
    >
      {items.map((item) => (
        <RadioListItem
          key={keyExtractor(item)}
          name={nameExtractor(item)}
          checked={
            keyExtractor(item) == keyExtractor(value) ? "checked" : "unchecked"
          }
          onCheck={() => onItemSelect(item)}
        />
      ))}
    </BaseFormCard>
  );
}

interface RadioListItemProps {
  name: string;
  checked: "checked" | "unchecked";
  onCheck: () => void;
}

function RadioListItem({ name, checked, onCheck }: RadioListItemProps) {
  const theme = useTheme();

  return (
    <View style={styles.radioItemContainer}>
      <View style={styles.radioItem}>
        <Text variant="bodySmall" style={{ padding: 5 }}>
          {name}
        </Text>
        <RadioButton value="" status={checked} onPress={onCheck} />
      </View>
      <Divider style={{ backgroundColor: theme.colors.primary }} />
    </View>
  );
}

const styles = StyleSheet.create({
  radioItemContainer: {
    flex: 1,
  },
  radioItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
