import { useAuth } from "@/src/context/AuthContext";
import { styles } from "@/src/styles/screens/login.styles";
import {
  Link,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function LoginScreen() {
  const { signIn, loading, user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ redirectTo?: string }>();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    try {
      await signIn(email.trim(), password);
      // La redirección post-login la maneja el efecto que observa `user`
    } catch (e: any) {
      setError(e.message ?? "Error al iniciar sesión");
      const current =
        typeof params.redirectTo === "string" && params.redirectTo
          ? params.redirectTo
          : pathname || "/(tabs)";
      router.replace(
        `/(tabs)/(protected)/login?redirectTo=${encodeURIComponent(
          current
        )}` as unknown as any
      );
    }
  };

  const to =
    (typeof params.redirectTo === "string" && params.redirectTo) ||
    "/(tabs)/(protected)/profile";

  useEffect(() => {
    if (user) {
      router.replace(to as unknown as any);
    }
  }, [user, to, router]);

  if (user) return null;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
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
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={onSubmit}
        loading={loading}
        disabled={!email || !password}
      >
        Entrar
      </Button>
      <Link href="/(tabs)/(protected)/signup" asChild>
        <Button mode="text" compact>
          ¿No tenés cuenta? Crear cuenta
        </Button>
      </Link>
    </View>
  );
}
