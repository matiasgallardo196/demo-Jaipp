import { useAuth } from "@/src/context/AuthContext";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function LoginScreen() {
  const { signIn, loading } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ redirectTo?: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    try {
      await signIn(email.trim(), password);
      const dest =
        typeof params.redirectTo === "string" && params.redirectTo
          ? params.redirectTo
          : "/(tabs)/profile";
      router.replace(dest);
    } catch (e: any) {
      setError(e.message ?? "Error al iniciar sesión");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text
        variant="headlineMedium"
        style={{ textAlign: "center", marginBottom: 16 }}
      >
        Iniciar sesión
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
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={onSubmit}
        loading={loading}
        disabled={!email || !password}
      >
        Entrar
      </Button>
      <Link href="/(tabs)/auth/signup" asChild>
        <Button mode="text" compact>
          ¿No tenés cuenta? Crear cuenta
        </Button>
      </Link>
      <Link href="/(tabs)" asChild>
        <Button mode="text" compact>
          Volver al feed público
        </Button>
      </Link>
    </View>
  );
}
