import { styles } from "@/src/components/VideoPlayer/styles";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Platform, Pressable, View } from "react-native";

export const VideoPlayer: React.FC<{
  uri: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  showProgress?: boolean;
  showVolume?: boolean; // controla visibilidad del botón de mute
  defaultMuted?: boolean;
  onMuteChange?: (isMuted: boolean) => void;
}> = ({
  uri,
  width = 320,
  height = 200,
  autoplay = false,
  loop = false,
  muted,
  showControls = true,
  showProgress = true,
  showVolume = true,
  defaultMuted,
  onMuteChange,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(
    muted ?? defaultMuted ?? false
  );
  const [controlsVisible, setControlsVisible] = useState<boolean>(false);
  const progressWidthRef = useRef<number>(0);
  const pollIntervalRef = useRef<number | null>(null);
  const controlsTimerRef = useRef<number | null>(null);
  const controlsOpacity = useRef(new Animated.Value(0)).current;
  const player = useVideoPlayer({ uri, headers: undefined }, (p) => {
    p.loop = false;
    const initialMuted = muted ?? defaultMuted ?? false;
    p.muted = initialMuted;
    setIsMuted(initialMuted);
  });

  useEffect(() => {
    if (!player) return;
    player.loop = false;
    const effectiveMuted = muted !== undefined ? muted : isMuted;
    player.muted = effectiveMuted;
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
      } catch {}
    });

    // Poll simple status to keep progress updated (avoids relying on specific events)
    if (pollIntervalRef.current !== null) {
      clearInterval(pollIntervalRef.current);
    }
    pollIntervalRef.current = setInterval(() => {
      try {
        // @ts-ignore
        const d = Number(player.duration) || 0;
        // @ts-ignore
        const ct = Number(player.currentTime) || 0;
        if (!Number.isNaN(d)) setDuration(d);
        if (!Number.isNaN(ct)) setCurrentTime(ct);
      } catch {}
    }, 500) as unknown as number;

    return () => {
      try {
        subEnd?.remove?.();
        subPlay?.remove?.();
      } catch {}
      try {
        player.pause();
      } catch {}
      if (pollIntervalRef.current !== null) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [player, autoplay, loop, muted, isMuted]);

  // Sincroniza estado local cuando la prop controlada cambia
  useEffect(() => {
    if (muted !== undefined) {
      setIsMuted(!!muted);
    }
  }, [muted]);

  const onTogglePlay = useCallback(() => {
    if (!player) return;
    try {
      if (player.playing) {
        player.pause();
        setIsPlaying(false);
      } else {
        player.play();
        setIsPlaying(true);
      }
    } catch {}
  }, [player]);

  const animateControlsTo = useCallback(
    (toValue: number) => {
      Animated.timing(controlsOpacity, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }).start();
    },
    [controlsOpacity]
  );

  const scheduleHideControls = useCallback(() => {
    if (controlsTimerRef.current !== null) {
      clearTimeout(controlsTimerRef.current);
    }
    controlsTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
      animateControlsTo(0);
      controlsTimerRef.current = null;
    }, 3000) as unknown as number;
  }, [animateControlsTo]);

  const showControlsTemporarily = useCallback(() => {
    setControlsVisible(true);
    animateControlsTo(1);
    scheduleHideControls();
  }, [animateControlsTo, scheduleHideControls]);

  const onToggleControls = useCallback(() => {
    setControlsVisible((prev) => {
      const next = !prev;
      if (next) {
        animateControlsTo(1);
        scheduleHideControls();
      } else {
        if (controlsTimerRef.current !== null) {
          clearTimeout(controlsTimerRef.current);
          controlsTimerRef.current = null;
        }
        animateControlsTo(0);
      }
      return next;
    });
  }, [animateControlsTo, scheduleHideControls]);

  const onSeekToRatio = useCallback(
    (ratio: number) => {
      if (!player) return;
      try {
        const clamped = Math.max(0, Math.min(1, ratio));
        const target = clamped * (duration || 0);
        // @ts-ignore
        player.currentTime = target;
        setCurrentTime(target);
      } catch {}
    },
    [player, duration]
  );

  const onProgressBarPress = useCallback(
    (e: any) => {
      try {
        const width = progressWidthRef.current || 1;
        const x = e?.nativeEvent?.locationX ?? 0;
        onSeekToRatio(x / width);
        showControlsTemporarily();
      } catch {}
    },
    [onSeekToRatio, showControlsTemporarily]
  );

  const onProgressLayout = useCallback((e: any) => {
    try {
      progressWidthRef.current = e?.nativeEvent?.layout?.width ?? 0;
    } catch {}
  }, []);

  const toggleMute = useCallback(() => {
    try {
      if (!player) return;
      const next = !isMuted;
      player.muted = next;
      setIsMuted(next);
      onMuteChange?.(next);
      showControlsTemporarily();
    } catch {}
  }, [player, isMuted, onMuteChange, showControlsTemporarily]);

  return (
    <View style={[styles.container, { width, height }]}>
      <VideoView
        style={styles.video}
        contentFit="cover"
        fullscreenOptions={{ enable: true }}
        {...(Platform.OS === "android"
          ? { surfaceType: "textureView" as const }
          : {})}
        nativeControls={false}
        player={player}
      />

      <Pressable onPress={onToggleControls} style={styles.overlayPressable} />

      {/* Overlay central de pausa retirado a pedido: se usan solo los controles de la barra */}

      {showControls ? (
        <Animated.View
          pointerEvents={controlsVisible ? "box-none" : "none"}
          style={[styles.controlsWrapper, { opacity: controlsOpacity }]}
        >
          {showProgress ? (
            <Pressable
              onPress={onProgressBarPress}
              onLayout={onProgressLayout}
              style={styles.progressContainer}
            >
              <View style={styles.progressBackground} />
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      duration > 0
                        ? `${Math.min(
                            100,
                            Math.max(0, (currentTime / duration) * 100)
                          )}%`
                        : "0%",
                  },
                ]}
              />
            </Pressable>
          ) : null}

          <View style={styles.controlsRow}>
            <Pressable
              onPress={() => {
                onTogglePlay();
                showControlsTemporarily();
              }}
              style={styles.controlButton}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={22}
                color="#FFFFFF"
              />
            </Pressable>

            {showVolume ? (
              <Pressable onPress={toggleMute} style={styles.controlButton}>
                <Ionicons
                  name={isMuted ? "volume-mute" : "volume-high"}
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>
            ) : null}
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
};
