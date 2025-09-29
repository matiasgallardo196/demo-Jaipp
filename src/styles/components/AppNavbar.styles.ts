import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#1A1A1A",
  },
  container: {
    height: 56,
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 94,
    height: 76,
    resizeMode: "contain" as any,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 4,
  },
  avatarFallback: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 4,
    backgroundColor: "#FD3B4A",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    color: "#fff",
    fontWeight: "bold",
  },
  displayName: {
    color: "#FD3B4A",
  },
  logoutLabel: {
    color: "#FD3B4A",
  },
  signupLabel: {
    color: "#d32f2f",
  },
  signupIcon: {
    width: 12,
    height: 12,
    resizeMode: "contain" as any,
  },
});
