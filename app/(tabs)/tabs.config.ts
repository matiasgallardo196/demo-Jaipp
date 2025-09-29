import { ImageSourcePropType } from "react-native";

type TabScreenDefinition = {
  name: string;
  title: string;
  icon: ImageSourcePropType;
  href?: string;
};

export const TAB_SCREENS: TabScreenDefinition[] = [
  {
    name: "feed/index",
    title: "Home",
    icon: {
      uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/Vector%20(1).png",
    },
  },
  {
    name: "musica/index",
    title: "Musica",
    icon: {
      uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/Group.png",
    },
  },
  {
    name: "librito/index",
    title: "Librito",
    icon: {
      uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/vector%20librito.png",
    },
  },
  {
    name: "(protected)",
    title: "Mi perfil",
    icon: {
      uri: "https://bcnhjznvtcgxloyoeqyl.supabase.co/storage/v1/object/public/assets/vector%20profile.png",
    },
    href: "/(tabs)/(protected)/profile",
  },
];
