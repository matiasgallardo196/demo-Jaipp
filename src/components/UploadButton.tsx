import React, { useCallback } from "react";
import { Alert } from "react-native";
import { Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

export type PickedVideo = {
  uri: string;
  fileName?: string;
  mimeType?: string;
};

export const UploadButton: React.FC<{
  onPicked: (video: PickedVideo) => void;
  disabled?: boolean;
}> = ({ onPicked, disabled }) => {
  const openPicker = useCallback(async () => {
    // Pedir permiso explícitamente para Android 13+ y iOS
    const current = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (current.status !== "granted") {
      const req = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (req.status !== "granted") {
        Alert.alert(
          "Permiso requerido",
          "Necesitamos acceso a la galería para seleccionar videos."
        );
        return;
      }
    }

    // Intentar API nueva primero; si no está disponible, no pasar mediaTypes para evitar warning
    const newMediaType = (ImagePicker as any)?.MediaType?.video;
    const options: any = {
      allowsEditing: false,
      quality: 1,
    };
    // Si existe la API nueva, usamos solo videos; si no, caemos al fallback deprecado
    options.mediaTypes = newMediaType
      ? [newMediaType]
      : (ImagePicker as any).MediaTypeOptions?.Videos;
    const result = await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset =
        result.assets.find((a: any) => (a.type ?? "video").includes("video")) ??
        result.assets[0];
      onPicked({
        uri: asset.uri,
        fileName: (asset as any).fileName ?? undefined,
        mimeType: (asset as any).mimeType ?? undefined,
      });
    }
  }, [onPicked]);

  return (
    <Button mode="contained" onPress={openPicker} disabled={disabled}>
      Elegir video
    </Button>
  );
};
