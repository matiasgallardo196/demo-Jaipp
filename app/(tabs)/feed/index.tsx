import { VideoFilterOverlay } from "@/src/components/VideoFilterOverlay";
import { VideoOverlayCard } from "@/src/components/VideoOverlayCard";
import { VideoPlayer } from "@/src/components/VideoPlayer";
import { FEED_ASSETS } from "@/src/config/feed.assets";
import { supabase } from "@/src/lib/supabase";
import { styles } from "@/src/styles/screens/feed.styles";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import { Text } from "react-native-paper";

type PublicVideoItem = {
  path: string;
  url: string;
  creatorName?: string;
  creatorAvatarUrl?: string;
  description?: string;
};

export default function HomeScreen() {
  const { width, height: windowHeight } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight() || 0;
  const isFocused = useIsFocused();

  // El header (navbar) se renderiza desde Tabs, así que solo restamos tabBar
  const availableHeight = Math.max(0, windowHeight - tabBarHeight);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const snap = Math.max(
    1,
    Math.round(containerHeight > 0 ? containerHeight : availableHeight)
  ); // evita issues de rounding y desbordes
  const overlayOffset = Math.max(16, Math.min(64, Math.round(snap * 0.08)));

  const [videos, setVideos] = useState<PublicVideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastError, setLastError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const viewabilityConfigRef = useRef({ itemVisiblePercentThreshold: 80 });
  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length > 0) {
      const idx = viewableItems[0].index ?? 0;
      setCurrentIndex(idx);
    }
  });

  const loadAllVideos = useCallback(async () => {
    setLoading(true);
    setLastError(null);
    try {
      const { data: rows, error } = await supabase
        .from("videos")
        .select(
          "file_path, public_url, creator_name, creator_avatar_url, description, created_at"
        )
        .order("created_at", { ascending: false });

      if (!error && rows && rows.length > 0) {
        const fromTable: PublicVideoItem[] = rows.map((r: any) => {
          const path = r.file_path as string;
          const pub = r.public_url as string | null;
          const ensuredUrl =
            pub ??
            supabase.storage.from("videos").getPublicUrl(path).data.publicUrl;
          return {
            path,
            url: ensuredUrl,
            creatorName: r.creator_name ?? undefined,
            creatorAvatarUrl: r.creator_avatar_url ?? undefined,
            description: r.description ?? undefined,
          };
        });
        setVideos(fromTable);
        return;
      }

      // (Fallback de listar storage omitido por brevedad; igual que lo tenías)
      setVideos([]);
    } catch (e: any) {
      setLastError(e?.message ?? "Error cargando videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllVideos();
  }, [loadAllVideos]);

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const h = Math.max(1, Math.round(e.nativeEvent.layout.height));
        if (h !== containerHeight) setContainerHeight(h);
      }}
    >
      {lastError ? <Text style={styles.errorText}>{lastError}</Text> : null}

      <FlatList
        data={videos}
        keyExtractor={(item) => item.path}
        renderItem={({ item, index }) => (
          <View style={[styles.videoItem, { width, height: snap }]}>
            <VideoPlayer
              uri={item.url}
              width={width}
              height={snap}
              autoplay={isFocused && index === currentIndex}
              loop
            />

            <VideoFilterOverlay
              uri={FEED_ASSETS.filterOverlay}
              resizeMode="cover"
            />

            {/* Tarjeta por encima del filtro */}
            <VideoOverlayCard
              width={width}
              overlayOffset={overlayOffset}
              creatorName={item.creatorName}
              creatorAvatarUrl={item.creatorAvatarUrl}
              description={item.description}
            />
          </View>
        )}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        bounces={false}
        removeClippedSubviews
        snapToInterval={snap}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewabilityConfigRef.current}
        getItemLayout={(_, index) => ({
          length: snap,
          offset: snap * index,
          index,
        })}
        style={styles.list}
        ListEmptyComponent={
          <View style={[styles.empty, { width, height: snap }]}>
            <Text>{loading ? "Cargando..." : "No hay videos disponibles"}</Text>
          </View>
        }
      />
    </View>
  );
}
