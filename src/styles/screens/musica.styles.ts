import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native";

export const styles = StyleSheet.create<{
  container: ViewStyle;
  image: ImageStyle;
  title: TextStyle;
  default: TextStyle;
  caption: TextStyle;
  tip: TextStyle;
  link: TextStyle;
}>({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 16,
    opacity: 0.9,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    marginTop: 8,
    opacity: 0.8,
  },
  tip: {
    marginTop: 4,
  },
  link: {
    color: "#FD3B4A",
    fontWeight: "600",
  },
});
