import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { Link, usePathname } from "expo-router";
import React, { useState } from "react";
import { Platform, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function SignupScreen() {
  const { signUp, signIn, loading } = useAuth();
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);

  const pickAvatar = async () => {
    setError(null);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setError("Permiso de galería denegado");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;
    setAvatarUri(asset.uri);
  };

  const onSubmit = async () => {
    setError(null);
    try {
      try {
        await signUp(email.trim(), password, name.trim());
      } catch (e: any) {
        const msg = (e?.message ?? "").toString().toLowerCase();
        if (
          msg.includes("already registered") ||
          msg.includes("already exists")
        ) {
          await signIn(email.trim(), password);
        } else {
          throw e;
        }
      }

      if (avatarUri) {
        setUploadingAvatar(true);
        try {
          const { data: sess } = await supabase.auth.getSession();
          const userId = sess.session?.user?.id;
          const bearerToken =
            sess.session?.access_token ||
            (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string);
          if (!userId) throw new Error("No se pudo obtener el usuario");

          const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
          const fileExt = (avatarUri.split(".").pop() || "jpg").toLowerCase();
          const filePath = `${userId}.${fileExt}`;
          const uploadUrl = `${supabaseUrl}/storage/v1/object/avatar/${encodeURIComponent(
            filePath
          )}`;

          const form = new FormData();
          const mime = `image/${fileExt === "jpg" ? "jpeg" : fileExt}`;
          if (Platform.OS === "web") {
            const res = await fetch(avatarUri);
            const blob = await res.blob();
            form.append("file", blob, `avatar.${fileExt}`);
          } else {
            form.append("file", {
              uri: avatarUri,
              name: `avatar.${fileExt}`,
              type: mime,
            } as any);
          }

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
            throw new Error(`Error subiendo avatar: ${resp.status} - ${body}`);
          }

          const { data: pub } = supabase.storage
            .from("avatar")
            .getPublicUrl(filePath);
          const avatarUrl = pub.publicUrl;

          await supabase.auth.updateUser({
            data: { avatar_url: avatarUrl },
          });
        } finally {
          setUploadingAvatar(false);
        }
      }
    } catch (e: any) {
      setError(e.message ?? "Error al crear cuenta");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text
        variant="headlineMedium"
        style={{ textAlign: "center", marginBottom: 16 }}
      >
        Crear cuenta
      </Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Button mode="outlined" onPress={pickAvatar} disabled={loading}>
          Elegir avatar
        </Button>
        {avatarUri ? (
          <Text numberOfLines={1} style={{ flex: 1 }}>
            Avatar seleccionado
          </Text>
        ) : null}
      </View>
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={onSubmit}
        loading={loading || uploadingAvatar}
        disabled={!name || !email || !password}
      >
        Registrarme
      </Button>
      <Button mode="text" compact>
        <Link
          href={`/(tabs)/login?redirectTo=${encodeURIComponent(
            pathname || "/(tabs)"
          )}`}
        >
          ¿Ya tenés cuenta? Iniciar sesión
        </Link>
      </Button>
    </View>
  );
}
