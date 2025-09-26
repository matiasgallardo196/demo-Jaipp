import { useAuth } from "@/src/context/AuthContext";
import { Link } from "expo-router";
import React, { useCallback } from "react";
import { Image, StatusBar, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export const AppNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const displayName =
    ((user as any)?.user_metadata?.name as string | undefined) ??
    user?.email ??
    "";
  const avatarUrl =
    ((user as any)?.user_metadata?.avatar_url as string | undefined) ??
    undefined;
  const avatarInitial = (displayName || "?").charAt(0).toUpperCase();

  const onLogout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: "#1A1A1A" }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1A1A1A"
        translucent={false} // 👈 asegura que no se vea nada detrás
      />
      <View
        style={{
          height: 56,
          backgroundColor: "#1A1A1A",
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          //marginTop: 30,
        }}
      >
        <Image
          source={{
            uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/dc32a478fc88f905a7fc0c7a371ac35445e2d90f.png",
          }}
          style={{ width: 94, height: 76, resizeMode: "contain" as any }}
        />
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          {user ? (
            <>
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    marginRight: 4,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    marginRight: 4,
                    backgroundColor: "#FD3B4A",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    {avatarInitial}
                  </Text>
                </View>
              )}
              <Text style={{ color: "#FD3B4A" }}>{displayName}</Text>
              <Link href="/(tabs)/profile" asChild>
                <Button mode="text" labelStyle={{ color: "#FD3B4A" }}>
                  Mi perfil
                </Button>
              </Link>
              <Button
                mode="text"
                onPress={onLogout}
                labelStyle={{ color: "#FD3B4A" }}
              >
                Salir
              </Button>
            </>
          ) : (
            <Link href="/auth/signup" asChild>
              <Button
                mode="text"
                labelStyle={{ color: "#d32f2f" }}
                icon={() => (
                  <Image
                    source={{
                      uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/Vector.png",
                    }}
                    style={{
                      width: 12,
                      height: 12,
                      resizeMode: "contain" as any,
                    }}
                  />
                )}
              >
                Crear cuenta
              </Button>
            </Link>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
