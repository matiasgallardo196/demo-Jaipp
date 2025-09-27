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

  const isInAuth =
    pathname?.startsWith("/auth") || pathname?.startsWith("/(tabs)/auth");
  const isPublicRoot = pathname === "/";
  const isPublicTab =
    pathname === "/(tabs)" ||
    pathname?.startsWith("/(tabs)/index") ||
    pathname?.startsWith("/(tabs)/librito") ||
    pathname?.startsWith("/(tabs)/musica") ||
    pathname === "/index" ||
    pathname?.startsWith("/librito") ||
    pathname?.startsWith("/musica");
  // Permitir tabs públicos y "/" sin sesión; si tocan profile sin login => login
  if (!user && !isInAuth && !isPublicRoot && !isPublicTab) {
    const isProfileTab =
      pathname?.startsWith("/(tabs)/profile") ||
      pathname?.startsWith("/profile");
    if (isProfileTab) {
      const redirectTo = pathname ?? "/(tabs)/profile";
      return (
        <Redirect
          href={`/(tabs)/auth/login?redirectTo=${encodeURIComponent(
            redirectTo
          )}`}
        />
      );
    }
    return <Redirect href="/(tabs)" />;
  }

  if (user && isInAuth) {
    return <Redirect href="/(tabs)/profile" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />
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
