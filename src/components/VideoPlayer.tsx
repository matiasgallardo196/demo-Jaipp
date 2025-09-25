import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect } from "react";
import { View } from "react-native";

export const VideoPlayer: React.FC<{
  uri: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}> = ({
  uri,
  width = 320,
  height = 200,
  autoplay = false,
  loop = false,
  muted = false,
}) => {
  const player = useVideoPlayer(
    {
      uri,
      headers: undefined,
    },
    (p) => {
      p.loop = loop;
      p.muted = muted;
    }
  );

  useEffect(() => {
    if (!player) return;
    player.loop = loop;
    player.muted = muted;
    if (autoplay) {
      player.play();
    } else {
      player.pause();
    }
  }, [player, autoplay, loop, muted]);

  return (
    <View style={{ width, height }}>
      <VideoView
        style={{ width: "100%", height: "100%", backgroundColor: "#000" }}
        contentFit="cover"
        allowsFullscreen
        allowsPictureInPicture
        nativeControls={false}
        player={player}
      />
    </View>
  );
};
