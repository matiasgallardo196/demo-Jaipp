import { useAuth } from "@/src/context/AuthContext";
import { styles } from "@/src/styles/components/AppNavbar.styles";
import { Link, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Image, StatusBar, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export const AppNavbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const displayName =
    ((user as any)?.user_metadata?.name as string | undefined) ??
    user?.email ??
    "";
  const avatarUrl =
    ((user as any)?.user_metadata?.avatar_url as string | undefined) ??
    undefined;
  const avatarInitial = (displayName || "?").charAt(0).toUpperCase();

  const onLogout = useCallback(async () => {
    // Primero navegamos al feed público para salir de cualquier ruta protegida
    router.replace("/(tabs)/feed");
    // Luego cerramos sesión
    await signOut();
  }, [router, signOut]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1A1A1A"
        translucent={false} // 👈 asegura que no se vea nada detrás
      />
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/dc32a478fc88f905a7fc0c7a371ac35445e2d90f.png",
          }}
          style={styles.logo}
        />
        <View style={styles.row}>
          {user ? (
            <>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarFallbackText}>{avatarInitial}</Text>
                </View>
              )}
              <Text style={styles.displayName}>{displayName}</Text>
              <Button
                mode="text"
                onPress={onLogout}
                labelStyle={styles.logoutLabel}
              >
                Salir
              </Button>
            </>
          ) : (
            <Link href="/(tabs)/(protected)/signup" asChild>
              <Button
                mode="text"
                labelStyle={styles.signupLabel}
                icon={() => (
                  <Image
                    source={{
                      uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/Vector.png",
                    }}
                    style={styles.signupIcon}
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
