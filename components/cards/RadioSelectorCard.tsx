import { View, StyleSheet } from "react-native";
import {
  Text,
  Card,
  useTheme,
  IconButton,
  RadioButton,
  Divider,
} from "react-native-paper";

interface RadioSelectorCardProps<T> {
  title?: string;
  icon?: string;
  items: T[];
  value: T;
  onItemSelect: (value: T) => void;
  keyExtractor: (item: T) => string;
  nameExtractor: (item: T) => string;
}
export default function RadioSelectorCard<T>({
  title,
  icon,
  items,
  value,
  onItemSelect,
  keyExtractor,
  nameExtractor,
}: RadioSelectorCardProps<T>) {
  const theme = useTheme();

  return (
    <Card
      style={{
        borderColor: theme.colors.primary,
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
          {title ? <Text variant="titleSmall">{title}</Text> : null}
          {items.map((item) => (
            <RadioListItem
              key={keyExtractor(item)}
              name={nameExtractor(item)}
              checked={
                keyExtractor(item) == keyExtractor(value)
                  ? "checked"
                  : "unchecked"
              }
              onCheck={() => onItemSelect(item)}
            />
          ))}
        </View>
      </Card.Content>
    </Card>
  );
}

interface RadioListItemProps {
  name: string;
  checked: "checked" | "unchecked";
  onCheck: () => void;
}

function RadioListItem({ name, checked, onCheck }: RadioListItemProps) {
  return (
    <View style={styles.radioItemContainer}>
      <View style={styles.radioItem}>
        <Text variant="bodySmall" style={{ padding: 5 }}>
          {name}
        </Text>
        <RadioButton value="" status={checked} onPress={onCheck} />
      </View>
      <Divider />
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
