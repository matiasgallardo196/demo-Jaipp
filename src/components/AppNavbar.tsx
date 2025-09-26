import { useAuth } from "@/src/context/AuthContext";
import { Link } from "expo-router";
import React, { useCallback } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export const AppNavbar: React.FC = () => {
  const { user, signOut } = useAuth();

  const onLogout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  return (
    <View
      style={{
        height: 56,
        backgroundColor: "#ffd1dc", // rosa pastel
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text
        variant="titleLarge"
        style={{ fontWeight: "bold", color: "#d32f2f" }}
      >
        jaipp
      </Text>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        {user ? (
          <>
            <Text style={{ color: "#d32f2f" }}>
              {(user as any)?.user_metadata?.name ?? user.email}
            </Text>
            <Link href="/(tabs)/profile" asChild>
              <Button mode="text" labelStyle={{ color: "#d32f2f" }}>
                Mi perfil
              </Button>
            </Link>
            <Button
              mode="text"
              onPress={onLogout}
              labelStyle={{ color: "#d32f2f" }}
            >
              Salir
            </Button>
          </>
        ) : (
          <Link href="/auth/login" asChild>
            <Button mode="text" labelStyle={{ color: "#d32f2f" }}>
              Iniciar sesión
            </Button>
          </Link>
        )}
      </View>
    </View>
  );
};
