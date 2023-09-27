import { PropsWithChildren, useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text, Modal, Portal, Divider } from "react-native-paper";

export interface BaseModalProps extends PropsWithChildren {
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
  const [keyboardShown, setKeyboardShown] = useState(false);

  useEffect((): (() => void) => {
    const show = Keyboard.addListener("keyboardDidShow", () => {
      console.log("keyboard showing");
      setKeyboardShown(true);
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      console.log("keyboard hiding");
      setKeyboardShown(false);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.container,
          {
            // marginBottom: keyboardShown ? 50 : 240,
            top: keyboardShown ? "10%" : "15%",
          },
        ]}
      >
        <View style={styles.titleContainer}>
          <Text variant="titleLarge" style={styles.title}>
            {title}
          </Text>
          <Divider style={styles.divider} />
        </View>
        <ScrollView style={styles.contentContainer}>
          <View style={{ marginBottom: 250 }}>{children}</View>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  titleContainer: {
    paddingVertical: 5,
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
    paddingHorizontal: 15,
  },
});
