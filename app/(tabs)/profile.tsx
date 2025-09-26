import { AppNavbar } from "@/src/components/AppNavbar";
import { UploadButton, type PickedVideo } from "@/src/components/UploadButton";
import { VideoPlayer } from "@/src/components/VideoPlayer";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { Text } from "react-native-paper";

type VideoItem = { path: string; url: string };

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase.storage
      .from("videos")
      .list(`${user.id}/`, {
        limit: 1000,
        sortBy: { column: "name", order: "asc" },
      });
    if (error) {
      setLastError(error.message);
      return;
    }
    const items = data ?? [];
    const withUrls: VideoItem[] = items
      .filter((i) => !i.name.endsWith("/"))
      .map((i) => {
        const filePath = `${user.id}/${i.name}`;
        const { data } = supabase.storage.from("videos").getPublicUrl(filePath);
        return { path: filePath, url: data.publicUrl };
      });
    setVideos(withUrls);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onPicked = useCallback(
    async (video: PickedVideo) => {
      if (!user) return;
      setLoading(true);
      try {
        const fileName = video.fileName ?? `${Date.now()}.mp4`;
        const filePath = `${user.id}/${fileName}`;

        const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
        const { data: sess } = await supabase.auth.getSession();
        const bearerToken =
          sess.session?.access_token ??
          (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string);
        const uploadUrl = `${supabaseUrl}/storage/v1/object/videos/${encodeURIComponent(
          filePath
        )}`;

        const form = new FormData();
        form.append("file", {
          uri: video.uri,
          name: fileName,
          type: video.mimeType ?? "video/mp4",
        } as any);

        const resp = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "x-upsert": "true",
          },
          body: form,
        });
        if (!resp.ok) {
          const body = await resp.text();
          throw new Error(
            `Upload failed (${resp.status}): ${body.slice(0, 200)}`
          );
        }
        await refresh();
      } catch (e: any) {
        const message = e?.message ?? "Error subiendo video";
        setLastError(message);
        Alert.alert("Error", message);
      } finally {
        setLoading(false);
      }
    },
    [user, refresh]
  );

  return (
    <View style={{ flex: 1 }}>
      <AppNavbar />
      <View style={{ padding: 16, gap: 12 }}>
        <Text variant="titleLarge">Mi perfil</Text>
        <UploadButton onPicked={onPicked} disabled={loading} />
        {lastError ? <Text style={{ color: "red" }}>{lastError}</Text> : null}
        <FlatList
          data={videos}
          keyExtractor={(item) => item.path}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => <VideoPlayer uri={item.url} />}
          ListEmptyComponent={<Text>No hay videos</Text>}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>
    </View>
  );
}
