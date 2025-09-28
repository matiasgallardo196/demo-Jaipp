import { useAuth } from "@/src/context/AuthContext";
import { Redirect, Slot, useLocalSearchParams } from "expo-router";
import React from "react";

export default function AuthGroupLayout() {
  const { user, loading } = useAuth();
  const params = useLocalSearchParams<{ redirectTo?: string }>();

  if (loading) return null;

  if (user) {
    const to =
      (typeof params.redirectTo === "string" && params.redirectTo) ||
      "/(tabs)/(protected)/profile";
    return <Redirect href={to} />;
  }

  return <Slot />;
}
