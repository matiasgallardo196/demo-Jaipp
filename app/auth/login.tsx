import React, { useState } from "react";
import { View } from "react-native";
import { Link } from "expo-router";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "@/src/context/AuthContext";

export default function LoginScreen() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    try {
      await signIn(email.trim(), password);
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
      <Button mode="text" compact>
        <Link href="/auth/signup">¿No tenés cuenta? Crear cuenta</Link>
      </Button>
    </View>
  );
}
