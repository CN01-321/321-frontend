import { View, StyleSheet } from "react-native";
import { Checkbox, Divider, Text } from "react-native-paper";

interface PetListItemProps {
  name: string;
  checked?: "checked" | "unchecked" | "indeterminate";
  onCheck?: () => void;
}

export function PetListItem({ name, checked, onCheck }: PetListItemProps) {
  return (
    <View>
      <View style={styles.petItem}>
        <Text variant="bodySmall" style={{ paddingRight: "50%" }}>
          {name}
        </Text>
        <Checkbox status={checked ? checked : "checked"} onPress={onCheck} />
      </View>
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  petItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
