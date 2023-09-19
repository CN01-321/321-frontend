import { Text, useTheme } from "react-native-paper";

export default function ErrorText({ errMsg }: { errMsg?: string }) {
  const theme = useTheme();
  return <Text style={{ color: theme.colors.error }}>{errMsg ?? ""}</Text>;
}
