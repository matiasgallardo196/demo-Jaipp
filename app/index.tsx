import { Redirect } from "expo-router";
import React from "react";

export default function RootRedirect() {
  return <Redirect href="/(tabs)" />;
}
