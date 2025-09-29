import { styles } from "@/src/styles/components/VideoOverlayCard.styles";
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
      style={[styles.container, { bottom: 12 + overlayOffset }]}
    >
      <View style={styles.row}>
        {creatorAvatarUrl ? (
          <Image source={{ uri: creatorAvatarUrl }} style={styles.avatar} />
        ) : null}
        <View style={styles.rowFlex}>
          <Text
            numberOfLines={1}
            style={[styles.creatorName, { maxWidth: width - 24 }]}
          >
            {creatorName ? `@${creatorName}` : "Anónimo"}
          </Text>
          {description ? (
            <Text
              numberOfLines={2}
              style={[styles.description, { maxWidth: width - 24 }]}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
