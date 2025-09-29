import { useAuth } from "@/src/context/AuthContext";
import { Link, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Image, StatusBar, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { NAVBAR_ASSETS } from "./navbar.config";
import { styles } from "./styles";

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
    router.replace("/(tabs)/feed");
    await signOut();
  }, [router, signOut]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1A1A1A"
        translucent={false}
      />
      <View style={styles.container}>
        <Image source={{ uri: NAVBAR_ASSETS.logoUrl }} style={styles.logo} />
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
                    source={{ uri: NAVBAR_ASSETS.signupIconUrl }}
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
