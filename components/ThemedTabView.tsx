import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { useTheme } from "react-native-paper";
import {
  Route,
  SceneMap,
  TabBar,
  TabBarProps,
  TabView,
} from "react-native-tab-view";

interface SceneRoute {
  key: string;
  title: string;
  scene: () => JSX.Element;
}

interface ThemedTabViewProps {
  scenes: SceneRoute[];
}

export default function ThemedTabView({ scenes }: ThemedTabViewProps) {
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();

  const routes = scenes.map((s) => {
    return { key: s.key, title: s.title };
  });

  const renderScene = SceneMap(
    Object.fromEntries(scenes.map((s) => [s.key, s.scene]))
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={ThemedTabBar}
      onIndexChange={(index) => setIndex(index)}
      initialLayout={{ width: layout.width }}
    />
  );
}

function ThemedTabBar<T extends Route>(props: TabBarProps<T>) {
  const theme = useTheme();
  return (
    <TabBar
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{ elevation: 0, backgroundColor: "#FCFCFC" }}
      labelStyle={{
        color: "#1D1B20",
        fontFamily: "Montserrat-Medium",
      }}
      {...props}
    />
  );
}
