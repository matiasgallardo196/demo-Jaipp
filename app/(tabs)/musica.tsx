import React from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function MusicaScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Estamos trabajando en esta sección</ThemedText>
      <ThemedText type="default" style={styles.caption}>
        Pronto habrá novedades aquí.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  caption: {
    marginTop: 8,
    opacity: 0.8,
  },
});
