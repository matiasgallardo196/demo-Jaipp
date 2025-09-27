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
    <View
      pointerEvents="none"
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <Image
        source={{ uri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode={resizeMode}
      />
    </View>
  );
}
