import * as ImagePicker from "expo-image-picker";
import React, { useCallback } from "react";
import { Alert, View } from "react-native";
import { Button } from "react-native-paper";

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

  const openCamera = useCallback(async () => {
    // Permiso de cámara
    const current = await ImagePicker.getCameraPermissionsAsync();
    if (current.status !== "granted") {
      const req = await ImagePicker.requestCameraPermissionsAsync();
      if (req.status !== "granted") {
        Alert.alert(
          "Permiso requerido",
          "Necesitamos acceso a la cámara para grabar videos."
        );
        return;
      }
    }

    const newMediaType = (ImagePicker as any)?.MediaType?.video;
    const options: any = {
      quality: 1,
      videoMaxDuration: 60,
      allowsEditing: false,
    };
    options.mediaTypes = newMediaType
      ? [newMediaType]
      : (ImagePicker as any).MediaTypeOptions?.Videos;

    const result = await ImagePicker.launchCameraAsync(options);
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
    <View style={{ gap: 8, flexDirection: "row" }}>
      <Button mode="contained" onPress={openPicker} disabled={disabled}>
        Elegir video
      </Button>
      <Button mode="outlined" onPress={openCamera} disabled={disabled}>
        Grabar video
      </Button>
    </View>
  );
};
