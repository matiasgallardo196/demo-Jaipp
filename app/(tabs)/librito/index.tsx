import { styles } from "@/src/styles/screens/librito.styles";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";

export default function LibritoScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Ionicons
        name="book-outline"
        size={120}
        color={colors.text}
        style={{ marginBottom: 16, opacity: 0.9 }}
      />
      <Text style={[styles.title, { color: colors.text }]}>
        Estamos trabajando en esta sección
      </Text>
      <Text style={[styles.default, styles.caption, { color: colors.text }]}>
        Pronto habrá novedades aquí.
      </Text>
    </View>
  );
}
