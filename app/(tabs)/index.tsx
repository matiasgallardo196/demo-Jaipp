import { VideoPlayer } from "@/src/components/VideoPlayer";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Text } from "react-native-paper";

type PublicVideoItem = { path: string; url: string };

export default function HomeScreen() {
  const { user } = useAuth();
  const [videos, setVideos] = useState<PublicVideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastError, setLastError] = useState<string | null>(null);

  const loadAllVideos = useCallback(async () => {
    setLoading(true);
    setLastError(null);
    try {
      // Feed público (todas las carpetas) SIEMPRE
      const { data: rootItems, error: rootError } = await supabase.storage
        .from("videos")
        .list("", { limit: 1000, sortBy: { column: "name", order: "asc" } });
      if (rootError) throw rootError;
      const folders = (rootItems ?? []).filter((i: any) => !i.id);

      const all: PublicVideoItem[] = [];
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
          if (!file.id) continue;
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
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text variant="titleLarge">Explorar videos</Text>
        {user ? (
          <Link href="/(tabs)/profile" asChild>
            <Button mode="text">Mi perfil</Button>
          </Link>
        ) : (
          <Link href="/auth/login" asChild>
            <Button mode="text">Iniciar sesión</Button>
          </Link>
        )}
      </View>

      {lastError ? <Text style={{ color: "red" }}>{lastError}</Text> : null}

      <FlatList
        data={videos}
        keyExtractor={(item) => item.path}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => <VideoPlayer uri={item.url} />}
        ListEmptyComponent={
          <Text>{loading ? "Cargando..." : "No hay videos disponibles"}</Text>
        }
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}
