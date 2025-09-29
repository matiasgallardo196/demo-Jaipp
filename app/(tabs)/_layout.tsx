import { styles } from "@/src/styles/screens/tabs.styles";
import { Tabs } from "expo-router";
import React from "react";
// Colors removed: using fixed tab colors
import { AppNavbar } from "@/src/components/AppNavbar";
import { TabBarIcon } from "@/src/components/TabBarIcon";
import { TAB_SCREENS } from "./tabs.config";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FD3B4A",
        tabBarInactiveTintColor: "#9E9E9E",
        header: () => <AppNavbar />,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      {TAB_SCREENS.map(({ name, title, icon, href }) => (
        <Tabs.Screen
          key={name}
          name={name}
          {...(href ? { href } : {})}
          options={{
            title,
            tabBarIcon: ({ color }) => (
              <TabBarIcon source={icon} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
