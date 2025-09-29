import { styles } from "@/src/styles/components/VideoFilterOverlay.styles";
import React from "react";
import { Image, View } from "react-native";

export type VideoFilterOverlayProps = {
  uri: string;
  resizeMode?: "cover" | "contain" | "stretch" | "center" | "repeat";
};

export function VideoFilterOverlay({
  uri,
  resizeMode = "cover",
}: VideoFilterOverlayProps) {
  return (
    <View pointerEvents="none" style={styles.container}>
      <Image source={{ uri }} style={styles.image} resizeMode={resizeMode} />
    </View>
  );
}
