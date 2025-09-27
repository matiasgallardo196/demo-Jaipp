import React from "react";
import { Image, Text, View } from "react-native";

export type VideoOverlayCardProps = {
  width: number;
  overlayOffset?: number;
  creatorName?: string;
  creatorAvatarUrl?: string;
  description?: string;
};

export function VideoOverlayCard({
  width,
  overlayOffset = 32,
  creatorName,
  creatorAvatarUrl,
  description,
}: VideoOverlayCardProps) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 12 + overlayOffset,
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(0,0,0,0.35)",
          borderRadius: 8,
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        {creatorAvatarUrl ? (
          <Image
            source={{ uri: creatorAvatarUrl }}
            style={{ width: 128, height: 128, borderRadius: 12 }}
          />
        ) : null}
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "600",
              textShadowColor: "rgba(0,0,0,0.4)",
              textShadowRadius: 4,
              textShadowOffset: { width: 0, height: 1 },
              maxWidth: width - 24,
            }}
          >
            {creatorName ? `@${creatorName}` : "Anónimo"}
          </Text>
          {description ? (
            <Text
              numberOfLines={2}
              style={{
                color: "#fff",
                fontSize: 12,
                opacity: 0.9,
                marginTop: 2,
                maxWidth: width - 24,
              }}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
