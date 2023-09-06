import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text, Modal, Portal, Divider } from "react-native-paper";

interface BaseModalProps extends PropsWithChildren {
  title: string;
  visible: boolean;
  onDismiss: () => void;
}

export default function BaseModal({
  title,
  visible,
  onDismiss,
  children,
}: BaseModalProps) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <View style={styles.titleContainer}>
          <Text variant="titleLarge" style={styles.title}>
            {title}
          </Text>
          <Divider style={styles.divider} />
        </View>
        <ScrollView style={styles.contentContainer}>{children}</ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    top: "20%",
  },
  titleContainer: {
    paddingVertical: 10,
  },
  title: {
    padding: 10,
    textAlign: "center",
  },
  divider: {
    height: 1,
  },
  contentContainer: {
    backgroundColor: "white",
    flexGrow: 1,
    paddingHorizontal: 15,
  },
});
