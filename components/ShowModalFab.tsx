import { FAB } from "react-native-paper";

interface ShowModalFabProps {
  icon: string;
  showModal: () => void;
}

export default function ShowModalFab({ icon, showModal }: ShowModalFabProps) {
  return (
    <FAB
      icon={icon}
      style={{
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 50,
      }}
      onPress={showModal}
    />
  );
}
