/**
 * @file Base card component that each form card can inherit from
 * @author George Bull
 */

import { PropsWithChildren } from "react";
import { StyleProp, TextStyle, View } from "react-native";
import { Text, Card, IconButton, useTheme } from "react-native-paper";

export interface BaseFormCardProps extends PropsWithChildren {
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  icon?: string;
  border?: boolean;
}

export default function BaseFormCard({
  title,
  titleStyle,
  icon,
  border,
  children,
}: BaseFormCardProps) {
  const theme = useTheme();

  return (
    <Card
      style={{
        borderColor: border ? theme.colors.primary : "white",
        borderWidth: 1,
        marginTop: 5,
        shadowColor: "white",
        flex: 1,
      }}
    >
      <Card.Content style={{ flex: 1, paddingLeft: 0, flexDirection: "row" }}>
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
          {children}
        </View>
      </Card.Content>
    </Card>
  );
}
