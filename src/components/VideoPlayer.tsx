import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, Pressable, View } from "react-native";

export const VideoPlayer: React.FC<{
  uri: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  /** El componente ya no maneja overlays ni filtros visuales */
}> = ({
  uri,
  width = 320,
  height = 200,
  autoplay = false,
  loop = false,
  muted = false,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isUserPaused, setIsUserPaused] = useState<boolean>(false);
  const player = useVideoPlayer({ uri, headers: undefined }, (p) => {
    p.loop = false;
    p.muted = muted;
  });

  useEffect(() => {
    if (!player) return;
    player.loop = false;
    player.muted = muted;
    if (autoplay) {
      player.play();
    } else {
      player.pause();
    }
    try {
      /* @ts-ignore */ setIsPlaying(!!player.playing);
    } catch {}

    const subEnd = player.addListener?.("playToEnd", () => {
      try {
        player.currentTime = 0;
        if (loop) player.play();
      } catch {}
    });
    const subPlay = player.addListener?.("playingChange", (e: any) => {
      try {
        const playingNow = !!e?.isPlaying;
        setIsPlaying(playingNow);
        if (playingNow) setIsUserPaused(false);
      } catch {}
    });

    return () => {
      try {
        subEnd?.remove?.();
        subPlay?.remove?.();
      } catch {}
      try {
        player.pause();
      } catch {}
    };
  }, [player, autoplay, loop, muted]);

  const onTogglePlay = useCallback(() => {
    if (!player) return;
    try {
      if (player.playing) {
        player.pause();
        setIsPlaying(false);
        setIsUserPaused(true);
      } else {
        player.play();
        setIsPlaying(true);
        setIsUserPaused(false);
      }
    } catch {}
  }, [player]);

  return (
    <View style={{ width, height, position: "relative" }}>
      <VideoView
        style={{ width: "100%", height: "100%", backgroundColor: "#000" }}
        contentFit="cover"
        fullscreenOptions={{ enable: true }}
        {...(Platform.OS === "android"
          ? { surfaceType: "textureView" as const }
          : {})}
        nativeControls={false}
        player={player}
      />

      <Pressable
        onPress={onTogglePlay}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {!isPlaying && isUserPaused ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.35)",
              borderRadius: 48,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.25)",
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
              transform: [{ translateY: -height * 0.1 }],
            }}
          >
            <Ionicons name="pause" size={36} color="#FFFFFF" />
          </View>
        </View>
      ) : null}
    </View>
  );
};
