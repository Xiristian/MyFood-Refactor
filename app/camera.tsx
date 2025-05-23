import React from 'react';
import { Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import CustomImagePicker from '@/components/ImagePicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useDatabaseConnection } from '@/database/DatabaseConnection';
import { FoodDTO } from '@/backend/get-foods';

// Types
interface RouteParams {
  id: number;
  date: Date;
  loadData: () => Promise<void>;
}

// Custom Hooks
const useFoodCreation = (mealId: number, date: Date, loadData: () => Promise<void>) => {
  const [foods, setFoods] = useState<FoodDTO[]>([]);
  const { mealRepository } = useDatabaseConnection();

  useEffect(() => {
    const createFoods = async () => {
      try {
        await Promise.all(
          foods.map((food) =>
            mealRepository.createFood(
              food.food_name,
              food.quantity,
              food.calories,
              date,
              mealId,
              food.unit,
            )
          )
        );
        await loadData();
      } catch (error) {
        console.error('Erro ao criar alimentos:', error);
      }
    };

    if (foods.length > 0) {
      createFoods();
    }
  }, [foods, mealId, date]);

  return {
    foods,
    setFoods,
  };
};

// Components
const BackButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity style={styles.backButton} onPress={onPress}>
    <Feather name="arrow-left" size={25} style={styles.arrow} />
  </TouchableOpacity>
);

const FoodList: React.FC<{ foods: FoodDTO[] }> = ({ foods }) => (
  <>
    {foods.map((food) => (
      <View key={food.food_name} style={styles.foodItem}>
        <Text style={styles.foodText}>
          {food.food_name} {food.quantity} {food.unit}
        </Text>
      </View>
    ))}
  </>
);

const PreviewImage: React.FC<{ uri: string }> = ({ uri }) => (
  <Image source={{ uri }} style={styles.previewImage} />
);

const Separator = () => (
  <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
);

export default function CameraScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: RouteParams }>>();
  const { id, date, loadData } = route.params;

  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const { foods, setFoods } = useFoodCreation(id, date, loadData);

  const handleGoBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <BackButton onPress={handleGoBack} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CustomImagePicker
          setImage={setImage}
          setFoods={setFoods}
          setError={setError}
          goBack={handleGoBack}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}
        
        {foods.length > 0 && <FoodList foods={foods} />}
        
        <Separator />
        
        {image && <PreviewImage uri={image} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCEB',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
  },
  arrow: {
    marginTop: 20,
    color: '#547260',
  },
  separator: {
    height: 1,
    backgroundColor: '#E3E3E3',
    width: '80%',
    alignSelf: 'center',
    opacity: 0.8,
    marginVertical: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    borderRadius: 10,
  },
  foodItem: {
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  foodText: {
    color: '#547260',
    fontSize: 16,
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginVertical: 10,
  },
});
