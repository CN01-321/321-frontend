/**
 * @file Form Card for slider input
 * @author George Bull
 */

import Slider from "@react-native-community/slider";
import BaseFormCard, { BaseFormCardProps } from "./BaseFormCard";
import { Text, useTheme } from "react-native-paper";
import { View } from "react-native";

interface SliderSelectorCardProps extends BaseFormCardProps {
  min: number;
  max: number;
  step?: number;
  value?: number;
  onChange: (value: number) => void;
}

export default function SliderSelectorCard({
  title,
  titleStyle,
  icon,
  border,
  min,
  max,
  step,
  value,
  onChange,
}: SliderSelectorCardProps) {
  const theme = useTheme();

  return (
    <BaseFormCard
      title={title}
      titleStyle={titleStyle}
      icon={icon}
      border={border}
    >
      <Slider
        thumbTintColor={theme.colors.primary}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.primary}
        style={{ padding: 10 }}
        minimumValue={min}
        maximumValue={max}
        value={value ?? min}
        step={step}
        onValueChange={onChange}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
        }}
      >
        <Text variant="bodySmall">{min}</Text>
        <Text variant="bodySmall">{max}</Text>
      </View>
    </BaseFormCard>
  );
}
