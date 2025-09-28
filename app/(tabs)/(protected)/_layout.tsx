import { useAuth } from "@/src/context/AuthContext";
import { Redirect, Slot, usePathname } from "expo-router";
import React from "react";

export default function ProtectedGroupLayout() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return null;

  if (!user) {
    const redirectTo = pathname || "/(tabs)/(protected)/profile";
    return (
      <Redirect
        href={`/(auth)/login?redirectTo=${encodeURIComponent(redirectTo)}`}
      />
    );
  }

  return <Slot />;
}
