import { styles } from "@/src/styles/screens/musica.styles";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function MusicaScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Ionicons
        name="musical-notes-outline"
        size={120}
        color={colors.text}
        style={{ marginBottom: 16, opacity: 0.9 }}
      />
      <Text style={[styles.title, { color: colors.text, textAlign: "center" }]}>
        Estamos trabajando en esta sección
      </Text>
      <Text
        style={[
          styles.default,
          styles.caption,
          { color: colors.text, textAlign: "center" },
        ]}
      >
        Pronto habrá novedades aquí.{"\n"}Mientras tanto:
      </Text>
      <Button
        mode="contained"
        onPress={() => router.push("/(tabs)/feed")}
        style={{ marginTop: 24, borderRadius: 12 }}
        buttonColor="#FD3B4A"
        textColor="#ffffff"
      >
        Explorar el Feed
      </Button>
    </View>
  );
}
