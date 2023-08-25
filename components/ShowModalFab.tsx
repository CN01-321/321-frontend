import { Animated, StyleProp, ViewStyle } from "react-native";
import { FAB } from "react-native-paper";

interface ShowModalFabProps {
  icon: string;
  showModal: () => void;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
}

export default function ShowModalFab({
  icon,
  showModal,
  style,
}: ShowModalFabProps) {
  return (
    <FAB
      icon={icon}
      style={{
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        ...{ style },
      }}
      onPress={showModal}
    />
  );
}
