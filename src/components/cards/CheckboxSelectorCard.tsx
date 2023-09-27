import { View, StyleSheet } from "react-native";
import { Text, Checkbox, Divider } from "react-native-paper";
import BaseFormCard, { BaseFormCardProps } from "./BaseFormCard";

interface CheckboxSelectorCardProps<T> extends BaseFormCardProps {
  items: T[];
  values?: Map<string, boolean>;
  onItemSelect?: (event: Map<string, boolean>) => void;
  keyExtractor: (item: T) => string;
  nameExtractor: (item: T) => string;
}

export default function CheckboxSelectorCard<T>({
  title,
  titleStyle,
  icon,
  border,
  items,
  values,
  onItemSelect,
  keyExtractor,
  nameExtractor,
}: CheckboxSelectorCardProps<T>) {
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

    // toggle the current checkbox or set it as checked if not currently present
    const key = keyExtractor(item);
    const current = getValue(item);
    values.set(key, !current);
    onItemSelect(new Map([...values]));
  };

  console.log(values);

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
  return (
    <View style={styles.checkboxItemContainer}>
      <View style={styles.checkboxItem}>
        <Text variant="bodySmall" style={{ padding: 5 }}>
          {name}
        </Text>
        <Checkbox status={checked} onPress={onCheck} />
      </View>
      <Divider />
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
