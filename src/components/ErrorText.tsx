import { Text, useTheme } from "react-native-paper";

interface ErrorTextProps {
  children?: string;
}

export default function ErrorText({ children }: ErrorTextProps) {
  const theme = useTheme();

  if (!children) return null;

  return <Text style={{ color: theme.colors.error }}>{children}</Text>;
}
