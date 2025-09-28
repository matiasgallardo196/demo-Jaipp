import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function MusicaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estamos trabajando en esta sección</Text>
      <Text style={[styles.default, styles.caption]}>
        Pronto habrá novedades aquí.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    marginTop: 8,
    opacity: 0.8,
  },
});
