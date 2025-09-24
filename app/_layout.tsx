import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Redirect, Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { Provider as PaperProvider } from "react-native-paper";

export const unstable_settings = {
  anchor: "(tabs)",
};

function ProtectedStack() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return null;
  }

  const isInAuth = pathname?.startsWith("/auth");
  const isPublicRoot = pathname === "/";
  // Permitir ruta pública "/" sin sesión
  if (!user && !isInAuth && !isPublicRoot) {
    return <Redirect href="/" />;
  }

  if (user && isInAuth) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider>
        <AuthProvider>
          <ProtectedStack />
          <StatusBar style="auto" />
        </AuthProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
