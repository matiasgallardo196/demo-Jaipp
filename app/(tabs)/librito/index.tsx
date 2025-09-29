import { styles } from "@/src/styles/screens/librito.styles";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";

export default function LibritoScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Estamos trabajando en esta sección
      </Text>
      <Text style={[styles.default, styles.caption, { color: colors.text }]}>
        Pronto habrá novedades aquí.
      </Text>
    </View>
  );
}
