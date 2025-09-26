import { useAuth } from "@/src/context/AuthContext";
import { Link } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function SignupScreen() {
  const { signUp, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    try {
      await signUp(email.trim(), password, name.trim());
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
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={onSubmit}
        loading={loading}
        disabled={!name || !email || !password}
      >
        Registrarme
      </Button>
      <Button mode="text" compact>
        <Link href="/auth/login">¿Ya tenés cuenta? Iniciar sesión</Link>
      </Button>
    </View>
  );
}
