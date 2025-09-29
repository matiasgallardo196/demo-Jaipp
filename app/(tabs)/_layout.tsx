import { styles } from "@/src/styles/screens/tabs.styles";
import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";
// Colors removed: using fixed tab colors
import { AppNavbar } from "@/src/components/AppNavbar";

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
      <Tabs.Screen
        name="feed/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Image
              source={{
                uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/Vector%20(1).png",
              }}
              style={[styles.icon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />
      {/* Rutas de auth (login) movidas dentro de (protected) */}
      {/* signup movido dentro de (protected) */}
      <Tabs.Screen
        name="musica/index"
        options={{
          title: "Musica",
          tabBarIcon: ({ color }) => (
            <Image
              source={{
                uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/Group.png",
              }}
              style={[styles.icon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="librito/index"
        options={{
          title: "Librito",
          tabBarIcon: ({ color }) => (
            <Image
              source={{
                uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/vector%20librito.png",
              }}
              style={[styles.icon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(protected)"
        options={{
          title: "Mi perfil",
          tabBarIcon: ({ color }) => (
            <Image
              source={{
                uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/vector%20profile.png",
              }}
              style={[styles.icon, { tintColor: color }]}
              resizeMode="contain"
            />
          ),
          href: "/(tabs)/(protected)/profile",
        }}
      />
    </Tabs>
  );
}
