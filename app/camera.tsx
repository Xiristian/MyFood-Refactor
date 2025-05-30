import React, { useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { THEME } from '@/constants/theme';
import { MealService } from '@/database/services/MealService';

interface CameraScreenProps {
  onSuccess?: () => void;
}

export default function CameraScreen({ onSuccess }: CameraScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { id, date } = useLocalSearchParams<{ id: string; date: string }>();
  const mealService = MealService.getInstance();

  const takePicture = useCallback(async () => {
    if (cameraRef.current && id && date) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        await mealService.handleImageCapture(parseInt(id), photo.uri, new Date(date));
        if (onSuccess) {
          onSuccess();
        }
        router.back();
      } catch (error) {
        console.error('Erro ao tirar foto:', error);
      }
    }
  }, [onSuccess, router, id, date, mealService]);

  useEffect(() => {
    const timer = setTimeout(() => {
      takePicture();
    }, 1000);

    return () => clearTimeout(timer);
  }, [takePicture]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Precisamos da sua permissão para usar a câmera</Text>
        <Button onPress={requestPermission} title="Permitir acesso" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  container: {
    backgroundColor: THEME.COLORS.BACKGROUND.LIGHT,
    flex: 1,
  },
});
