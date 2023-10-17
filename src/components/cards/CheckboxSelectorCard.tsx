/**
 * @file Form Card for checkbox input
 * @author George Bull
 */

import { View, StyleSheet } from "react-native";
import { Text, Checkbox, Divider, useTheme } from "react-native-paper";
import BaseFormCard, { BaseFormCardProps } from "./BaseFormCard";

interface CheckboxSelectorCardProps<T, K extends string>
  extends BaseFormCardProps {
  items: T[]; // a list of items to choose from
  values?: Map<K, boolean>; // a map of which items have been selected
  onItemSelect?: (event: Map<K, boolean>) => void;
  keyExtractor: (item: T) => K;
  nameExtractor: (item: T) => string;
}

export default function CheckboxSelectorCard<T, K extends string>({
  title,
  titleStyle,
  icon,
  border,
  items,
  values,
  onItemSelect,
  keyExtractor,
  nameExtractor,
}: CheckboxSelectorCardProps<T, K>) {
  const getValue = (item: T) => {
    if (!values) {
      return true;
    }

    return values.get(keyExtractor(item)) ?? false;
  };

  const handleCheck = (item: T) => {
    // if values or onItemSelect do nothing
    if (!values || !onItemSelect) {
      return;
    }

    const key = keyExtractor(item);
    const current = getValue(item);

    // toggle the current checkbox or set it as checked if not currently present
    values.set(key, !current);
    onItemSelect(new Map([...values]));
  };

  return (
    <BaseFormCard
      title={title}
      titleStyle={titleStyle}
      icon={icon}
      border={border}
    >
      {items.map((item) => (
        <CheckboxListItem
          key={keyExtractor(item)}
          name={nameExtractor(item)}
          checked={getValue(item) ? "checked" : "unchecked"}
          onCheck={() => handleCheck(item)}
        />
      ))}
    </BaseFormCard>
  );
}

interface CheckboxListItem {
  name: string;
  checked: "checked" | "unchecked";
  onCheck?: () => void;
}
function CheckboxListItem({ name, checked, onCheck }: CheckboxListItem) {
  const theme = useTheme();

  return (
    <View style={styles.checkboxItemContainer}>
      <View style={styles.checkboxItem}>
        <Text variant="bodySmall" style={{ padding: 5 }}>
          {name}
        </Text>
        <Checkbox status={checked} onPress={onCheck} />
      </View>
      <Divider style={{ backgroundColor: theme.colors.primary }} />
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxItemContainer: {
    flex: 1,
  },
  checkboxItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
