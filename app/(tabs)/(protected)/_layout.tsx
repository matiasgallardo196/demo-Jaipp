import { useAuth } from "@/src/context/AuthContext";
import { router, Slot, usePathname, useSegments } from "expo-router";
import React, { useEffect } from "react";

export default function ProtectedGroupLayout() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const isInProtected =
      Array.isArray(segments) &&
      segments.length >= 2 &&
      segments[0] === "(tabs)" &&
      segments[1] === "(protected)";

    const leaf = Array.isArray(segments) ? segments[segments.length - 1] : null;

    if (!user) {
      // Permitimos ver login y signup dentro de (protected) cuando no hay sesión
      if (isInProtected && leaf !== "login" && leaf !== "signup") {
        const redirectTo = pathname || "/(tabs)/(protected)/profile";
        router.replace(
          `/(tabs)/(protected)/login?redirectTo=${encodeURIComponent(
            redirectTo
          )}` as any
        );
      }
      return;
    }

    // Si hay sesión y estamos en login o signup dentro de (protected), redirigimos al perfil
    if (isInProtected && (leaf === "login" || leaf === "signup")) {
      router.replace("/(tabs)/(protected)/profile" as any);
      return;
    }
  }, [user, loading, pathname, segments]);

  if (loading) return null;
  return <Slot />;
}
