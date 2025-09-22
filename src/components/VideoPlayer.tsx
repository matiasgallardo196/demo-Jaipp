import React from "react";
import { View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

export const VideoPlayer: React.FC<{
  uri: string;
  width?: number;
  height?: number;
}> = ({ uri, width = 320, height = 200 }) => {
  const player = useVideoPlayer(
    {
      uri,
      headers: undefined,
    },
    (p) => {
      p.loop = false;
      // No reproducir automáticamente para evitar consumo
      p.muted = false;
    }
  );

  return (
    <View style={{ width, height }}>
      <VideoView
        style={{ width: "100%", height: "100%", backgroundColor: "#000" }}
        contentFit="cover"
        allowsFullscreen
        allowsPictureInPicture
        nativeControls
        player={player}
      />
    </View>
  );
};
