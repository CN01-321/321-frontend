import { View, StyleSheet, TextStyle, StyleProp } from "react-native";
import {
  Text,
  Card,
  useTheme,
  Checkbox,
  Divider,
  IconButton,
} from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";

interface CheckboxSelectorCardProps<T> {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  icon?: IconSource;
  border?: boolean;
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
  const theme = useTheme();

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

  return (
    <Card
      style={{
        borderColor: border ? theme.colors.primary : "white",
        borderWidth: 1,
        marginTop: 5,
        shadowColor: "white",
      }}
    >
      <Card.Content style={{ paddingLeft: 0, flex: 1, flexDirection: "row" }}>
        {icon ? (
          <IconButton
            style={{ margin: 3 }}
            icon={icon}
            iconColor={theme.colors.primary}
          />
        ) : null}
        <View style={{ flex: 1 }}>
          {title ? (
            <Text variant="titleSmall" style={titleStyle}>
              {title}
            </Text>
          ) : null}
          {items.map((item) => (
            <CheckboxListItem
              key={keyExtractor(item)}
              name={nameExtractor(item)}
              checked={getValue(item) ? "checked" : "unchecked"}
              onCheck={() => handleCheck(item)}
            />
          ))}
        </View>
      </Card.Content>
    </Card>
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
