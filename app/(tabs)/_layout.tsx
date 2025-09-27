import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
// Colors removed: using fixed tab colors
// import { useColorScheme } from "@/hooks/use-color-scheme";
import { AppNavbar } from "@/src/components/AppNavbar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FD3B4A",
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarButton: HapticTab,
        header: () => <AppNavbar />,
        tabBarStyle: { backgroundColor: "#1A1A1A" },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Image
              source={{
                uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/Vector%20(1).png",
              }}
              style={{ width: 20, height: 20, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="musica"
        options={{
          title: "Musica",
          tabBarIcon: ({ color }) => (
            <Image
              source={{
                uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/Group.png",
              }}
              style={{ width: 20, height: 20, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="librito"
        options={{
          title: "Librito",
          tabBarIcon: ({ color }) => (
            <Image
              source={{
                uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/vector%20librito.png",
              }}
              style={{ width: 20, height: 20, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Mi perfil",
          tabBarIcon: ({ color }) => (
            <Image
              source={{
                uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/vector%20profile.png",
              }}
              style={{ width: 20, height: 20, tintColor: color }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
