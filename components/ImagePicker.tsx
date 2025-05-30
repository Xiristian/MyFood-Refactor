import React from 'react';
import { StyleSheet } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import { THEME } from '@/constants/theme';
import { Text, View } from './Themed';
import { readFoodsFromImage } from '@/backend/read-foods-from-image';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';

interface ImagePickerProps {
  onImageSelected: (uri: string) => void;
  children: React.ReactNode;
}

export default function ImagePicker({ onImageSelected, children }: ImagePickerProps) {
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const imagePickerOptions: ExpoImagePicker.ImagePickerOptions = {
        allowsEditing: true,
        quality: 1,
      };
      const imagePicked = await ExpoImagePicker.launchCameraAsync(imagePickerOptions);

      if (!imagePicked.canceled) {
        setLoading(true);
        onImageSelected(imagePicked.assets[0].uri);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container} onTouchEnd={pickImage}>
      {children}
      {loading ? (
        <Text>Carregando...</Text>
      ) : (
        <View style={styles.bottomButtons}>
          <TouchableOpacity onPress={takePhotoWithCamera}>
            <View style={styles.iconWithText} lightColor="#FFFCEB" darkColor="#3C3C3C">
              <Feather name="camera" size={54} color="#76A689" style={styles.icon} />
              <Text style={styles.iconDescription}>Fotografar</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.iconWithText} lightColor="#FFFCEB" darkColor="#3C3C3C">
              <Feather name="image" size={54} color="#76A689" style={styles.icon} />
              <Text style={styles.iconDescription}>Carregar foto</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  container: {
    alignItems: 'center',
    backgroundColor: THEME.COLORS.BACKGROUND.LIGHT,
    borderRadius: THEME.INPUT.BORDER_RADIUS,
    height: 200,
    justifyContent: 'center',
    width: '100%',
  },
  icon: {
    marginBottom: 5,
  },
  iconDescription: {
    color: '#76A689',
    fontSize: 18,
    marginTop: 5,
  },
  iconWithText: {
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 20,
  },
  separator: {
    backgroundColor: '#76A689',
    height: 0.5,
    marginVertical: 10,
    width: '100%',
  },
});
