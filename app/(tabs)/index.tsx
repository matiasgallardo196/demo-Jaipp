import { AppNavbar } from "@/src/components/AppNavbar";
import { VideoPlayer } from "@/src/components/VideoPlayer";
// import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
// import { Link } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import { Text } from "react-native-paper";

type PublicVideoItem = { path: string; url: string };

export default function HomeScreen() {
  // const { user } = useAuth();
  const { width, height } = Dimensions.get("window");
  const [videos, setVideos] = useState<PublicVideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastError, setLastError] = useState<string | null>(null);

  const loadAllVideos = useCallback(async () => {
    setLoading(true);
    setLastError(null);
    try {
      // Feed público (todas las carpetas) SIEMPRE usando rol anon vía REST
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
      const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;
      const listUrl = `${supabaseUrl}/storage/v1/object/list/videos`;
      const headers = {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        "Content-Type": "application/json",
      } as Record<string, string>;

      const rootResp = await fetch(listUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          prefix: "",
          limit: 1000,
          offset: 0,
          delimiter: "/",
          sortBy: { column: "name", order: "asc" },
        }),
      });
      if (!rootResp.ok) throw new Error(`Root list failed: ${rootResp.status}`);
      const rootItems = await rootResp.json();
      const folders = (rootItems ?? []).filter((i: any) => !i.id);

      const all: PublicVideoItem[] = [];
      for (const folder of folders) {
        const base = folder.name as string;
        const prefix = base.endsWith("/") ? base : `${base}/`;

        const itemsResp = await fetch(listUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            prefix,
            limit: 1000,
            offset: 0,
            delimiter: "/",
            sortBy: { column: "name", order: "asc" },
          }),
        });
        if (!itemsResp.ok) continue;
        const items = await itemsResp.json();

        for (const file of items ?? []) {
          if (!file.id) continue; // solo archivos
          const filePath = `${prefix}${file.name}`;
          const { data } = supabase.storage
            .from("videos")
            .getPublicUrl(filePath);
          all.push({ path: filePath, url: data.publicUrl });
        }
      }
      setVideos(all);
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
    <View style={{ flex: 1 }}>
      <AppNavbar />
      {lastError ? (
        <Text style={{ color: "red", padding: 8 }}>{lastError}</Text>
      ) : null}
      <FlatList
        data={videos}
        keyExtractor={(item) => item.path}
        renderItem={({ item }) => (
          <View style={{ width, height, backgroundColor: "#000" }}>
            <VideoPlayer uri={item.url} width={width} height={height} />
          </View>
        )}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        style={{ flex: 1 }}
        ListEmptyComponent={
          <View
            style={{
              width,
              height,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>{loading ? "Cargando..." : "No hay videos disponibles"}</Text>
          </View>
        }
      />
    </View>
  );
}
