import * as ImagePicker from "expo-image-picker";
import React, { useCallback } from "react";
import { Alert, View } from "react-native";
import { Button } from "react-native-paper";
import { styles } from "./styles";

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

    const newMediaType = (ImagePicker as any)?.MediaType?.video;
    const options: any = {
      allowsEditing: false,
      quality: 1,
    };
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
    <View style={styles.container}>
      <Button mode="contained" onPress={openPicker} disabled={disabled}>
        Elegir video
      </Button>
      <Button mode="outlined" onPress={openCamera} disabled={disabled}>
        Grabar video
      </Button>
    </View>
  );
};
