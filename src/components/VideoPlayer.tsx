import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";

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
      // Manejaremos el loop manualmente para evitar cierres en Android
      p.loop = false;
      p.muted = muted;
    }
  );

  useEffect(() => {
    if (!player) return;
    // Mantener loop nativo desactivado; gestionamos manualmente con playToEnd
    player.loop = false;
    player.muted = muted;
    if (autoplay) {
      player.play();
    } else {
      player.pause();
    }

    // Pausar de forma segura al finalizar si no hay loop
    const subscription = player.addListener?.("playToEnd", () => {
      try {
        // Reiniciar manualmente y reanudar si se solicita loop
        player.currentTime = 0;
        if (loop) player.play();
      } catch {}
    });

    return () => {
      try {
        subscription?.remove?.();
      } catch {}
      try {
        player.pause();
      } catch {}
    };
  }, [player, autoplay, loop, muted]);

  return (
    <View style={{ width, height }}>
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
    </View>
  );
};
