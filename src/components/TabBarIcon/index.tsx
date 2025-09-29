import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import { styles } from "./styles";

type TabBarIconProps = {
  source: ImageSourcePropType;
  color: string;
};

export const TabBarIcon: React.FC<TabBarIconProps> = ({ source, color }) => {
  return (
    <Image
      source={source}
      style={[styles.icon, { tintColor: color }]}
      resizeMode="contain"
    />
  );
};
