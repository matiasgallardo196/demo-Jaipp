import { VideoPlayer } from "@/src/components/VideoPlayer";
import { supabase } from "@/src/lib/supabase";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Button, Text } from "react-native-paper";

type PublicVideoItem = {
  path: string;
  url: string;
};

export default function PublicHomeScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [videos, setVideos] = useState<PublicVideoItem[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);

  const loadAllVideos = useCallback(async () => {
    setLoading(true);
    setLastError(null);
    try {
      // 1) Listar elementos en la raíz del bucket: carpetas de usuarios
      const { data: rootItems, error: rootError } = await supabase.storage
        .from("videos")
        .list("", { limit: 1000, sortBy: { column: "name", order: "asc" } });
      if (rootError) throw rootError;

      // En la raíz, las carpetas aparecen con id nulo
      const folders = (rootItems ?? []).filter((i: any) => !i.id);

      const allVideos: PublicVideoItem[] = [];

      // 2) Por cada carpeta, listar sus archivos
      for (const folder of folders) {
        const base = folder.name as string;
        const prefix = base.endsWith("/") ? base : `${base}/`;
        const { data: items, error } = await supabase.storage
          .from("videos")
          .list(prefix, {
            limit: 1000,
            sortBy: { column: "name", order: "asc" },
          });
        if (error) continue;

        for (const file of items ?? []) {
          if (!file.id) continue; // saltar subdirectorios
          const filePath = `${prefix}${file.name}`;
          const { data } = supabase.storage
            .from("videos")
            .getPublicUrl(filePath);
          allVideos.push({ path: filePath, url: data.publicUrl });
        }
      }

      setVideos(allVideos);
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
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      {/* Navbar simple */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text variant="titleLarge">Explorar videos</Text>
        <Link href="/auth/login" asChild>
          <Button mode="text">Iniciar sesión</Button>
        </Link>
      </View>

      {lastError ? <Text style={{ color: "red" }}>{lastError}</Text> : null}

      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.path}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => <VideoPlayer uri={item.url} />}
          ListEmptyComponent={<Text>No hay videos disponibles</Text>}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  );
}
