import { UploadButton, type PickedVideo } from "@/src/components/UploadButton";
import { VideoPlayer } from "@/src/components/VideoPlayer";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import { styles } from "@/src/styles/screens/profile.styles";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Image, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Dialog,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";

type VideoItem = {
  path: string;
  url: string;
  creatorName?: string;
  creatorAvatarUrl?: string;
  description?: string;
};

export default function ProfileScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { user } = useAuth();
  const displayName =
    ((user as any)?.user_metadata?.name as string | undefined) ??
    user?.email ??
    "";
  const avatarUrl =
    ((user as any)?.user_metadata?.avatar_url as string | undefined) ??
    undefined;
  const avatarInitial = (displayName || "?").charAt(0).toUpperCase();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [pendingVideo, setPendingVideo] = useState<PickedVideo | null>(null);
  const [pendingDescription, setPendingDescription] = useState<string>("");
  const [askDescription, setAskDescription] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    // Intentar listar desde la tabla videos primero
    try {
      const { data: rows, error: vidsError } = await supabase
        .from("videos")
        .select(
          "file_path, public_url, creator_name, creator_avatar_url, description, created_at"
        )
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });
      if (!vidsError && rows && rows.length > 0) {
        const fromTable: VideoItem[] = rows.map((r: any) => {
          const path = r.file_path as string;
          const pub = r.public_url as string | null;
          const ensuredUrl =
            pub ??
            supabase.storage.from("videos").getPublicUrl(path).data.publicUrl;
          return {
            path,
            url: ensuredUrl,
            creatorName: r.creator_name as string | undefined,
            creatorAvatarUrl: r.creator_avatar_url as string | undefined,
            description: r.description as string | undefined,
          };
        });
        setVideos(fromTable);
        return;
      }
    } catch {}

    // Fallback a Storage si la tabla no existe o no hay datos
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
        return {
          path: filePath,
          url: data.publicUrl,
          creatorName:
            (user as any)?.user_metadata?.name ?? user.email ?? undefined,
          creatorAvatarUrl: (user as any)?.user_metadata?.avatar_url as
            | string
            | undefined,
          description: undefined,
        };
      });
    setVideos(withUrls);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const doUpload = useCallback(
    async (video: PickedVideo, description: string) => {
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
        // Guardar registro en la tabla videos (ignorar error si no existe)
        try {
          const { data: pub } = supabase.storage
            .from("videos")
            .getPublicUrl(filePath);
          await supabase.from("videos").upsert(
            [
              {
                file_path: filePath,
                public_url: pub.publicUrl,
                creator_id: user.id,
                creator_name:
                  (user as any)?.user_metadata?.name ?? user.email ?? null,
                creator_avatar_url:
                  (user as any)?.user_metadata?.avatar_url ?? null,
                description: description || null,
              },
            ],
            { onConflict: "file_path" }
          );
        } catch {}
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

  const onPicked = useCallback((video: PickedVideo) => {
    setPendingVideo(video);
    setPendingDescription("");
    setAskDescription(true);
  }, []);

  const confirmUpload = useCallback(async () => {
    if (!pendingVideo) return;
    setAskDescription(false);
    await doUpload(pendingVideo, pendingDescription.trim());
    setPendingVideo(null);
    setPendingDescription("");
  }, [pendingVideo, pendingDescription, doUpload]);

  const cancelUpload = useCallback(() => {
    setAskDescription(false);
    setPendingVideo(null);
    setPendingDescription("");
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={styles.row}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{avatarInitial}</Text>
            </View>
          )}
          <Text variant="titleLarge">
            {user?.user_metadata?.name
              ? `Hola, ${user.user_metadata.name}`
              : "Mi perfil"}
          </Text>
        </View>
        <UploadButton onPicked={onPicked} disabled={loading} />
        {lastError ? <Text style={styles.errorText}>{lastError}</Text> : null}
        <Portal>
          <Dialog visible={askDescription} onDismiss={cancelUpload}>
            <Dialog.Title>Descripción del video</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Descripción"
                value={pendingDescription}
                onChangeText={setPendingDescription}
                mode="outlined"
                multiline
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={cancelUpload} disabled={loading}>
                Cancelar
              </Button>
              <Button onPress={confirmUpload} loading={loading}>
                Subir
              </Button>
            </Dialog.Actions>
          </Dialog>
          <Dialog visible={loading && !askDescription} dismissable={false}>
            <Dialog.Content style={styles.uploadDialogContent}>
              <ActivityIndicator />
              <Text>Subiendo video...</Text>
            </Dialog.Content>
          </Dialog>
        </Portal>
        <FlatList
          data={videos}
          keyExtractor={(item) => item.path}
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          renderItem={({ item }) => (
            <VideoPlayer uri={item.url} loop autoplay />
          )}
          ListEmptyComponent={<Text>No hay videos</Text>}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: tabBarHeight + 8 },
          ]}
          scrollIndicatorInsets={{ bottom: tabBarHeight }}
        />
      </View>
    </View>
  );
}
