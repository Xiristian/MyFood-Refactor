import React, { useCallback, useRef } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { THEME } from '@/constants/theme';
import { MealService } from '@/database/services/MealService';
import { EventEmitter } from '@/utils/EventEmitter';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { id, date } = useLocalSearchParams<{ id: string; date: string }>();
  const mealService = MealService.getInstance();

  const handleImage = useCallback(async (uri: string) => {
    if (!id || !date) {
      Alert.alert('Erro', 'Parâmetros inválidos');
      return;
    }

    try {
      await mealService.handleImageCapture(parseInt(id), uri, new Date(date));
      EventEmitter.emit('photoTaken');
      router.back();
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      Alert.alert('Erro', 'Não foi possível processar a imagem. Tente novamente.');
    }
  }, [id, date, router]);

  const takePicture = useCallback(async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      await handleImage(photo.uri);
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro ao tirar foto', 'Por favor, tente novamente');
    }
  }, [handleImage]);

  const pickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        await handleImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem. Tente novamente.');
    }
  }, [handleImage]);

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
      <View style={styles.buttonContainer}>
        <Button title="Tirar foto" onPress={takePicture} />
        <View style={styles.buttonSeparator} />
        <Button title="Escolher da galeria" onPress={pickImage} />
      </View>
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
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonSeparator: {
    height: 10,
  },
});
