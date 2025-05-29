import React from 'react';
import { Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import CustomImagePicker from '@/components/ImagePicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { FoodDTO } from '@/backend/get-foods';
import { MealService } from '@/database/services/MealService';

// Types
interface RouteParams {
  id: number;
  date: Date;
  loadData: () => Promise<void>;
}

// Constants
const THEME = {
  COLORS: {
    PRIMARY: '#547260',
    SECONDARY: '#76A689',
    BACKGROUND: '#FFFCEB',
    ERROR: '#FF6B6B',
    SEPARATOR: '#E3E3E3',
    FOOD_ITEM: '#F5F5F5',
  },
  SPACING: {
    PADDING: 10,
    MARGIN: {
      TOP: 20,
      VERTICAL: 5,
      HORIZONTAL: 20,
    },
  },
  BORDER: {
    RADIUS: {
      BUTTON: 8,
      IMAGE: 10,
    },
    WIDTH: 2,
  },
  ICON: {
    SIZE: {
      BACK: 25,
    },
  },
  IMAGE: {
    SIZE: 200,
  },
  FONT: {
    SIZE: {
      NORMAL: 16,
    },
  },
};

// Custom Hooks
const useFoodCreation = (mealId: number, date: Date, onSuccess: () => Promise<void>) => {
  const [foods, setFoods] = useState<FoodDTO[]>([]);
  const mealService = MealService.getInstance();

  useEffect(() => {
    const createFoods = async () => {
      try {
        await Promise.all(
          foods.map(food =>
            mealService.addFoodToMeal(mealId, {
              name: food.food_name,
              calories: food.calories,
              mealId: mealId,
              date: date
            })
          )
        );
        await onSuccess();
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
    <Feather name="arrow-left" size={THEME.ICON.SIZE.BACK} style={styles.arrow} />
  </TouchableOpacity>
);

const FoodList: React.FC<{ foods: FoodDTO[] }> = ({ foods }) => (
  <>
    {foods.map(food => (
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
  <View style={styles.separator} lightColor={THEME.COLORS.SEPARATOR} darkColor="rgba(255,255,255,0.1)" />
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  message ? <Text style={styles.errorText}>{message}</Text> : null
);

export default function CameraScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: RouteParams }>>();
  const { id, date, loadData } = route.params;

  const [imageUri, setImageUri] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { foods, setFoods } = useFoodCreation(id, date, loadData);

  const handleGoBack = () => navigation.goBack();

  return (
    <View style={styles.container}>
      <BackButton onPress={handleGoBack} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CustomImagePicker
          setImage={setImageUri}
          setFoods={setFoods}
          setError={setErrorMessage}
          goBack={handleGoBack}
        />

        <ErrorMessage message={errorMessage} />
        
        {foods.length > 0 && <FoodList foods={foods} />}
        
        <Separator />
        
        {imageUri && <PreviewImage uri={imageUri} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: THEME.SPACING.MARGIN.TOP,
  },
  backButton: {
    position: 'absolute',
    top: THEME.SPACING.MARGIN.TOP,
    left: THEME.SPACING.PADDING,
    zIndex: 1,
  },
  arrow: {
    marginTop: THEME.SPACING.MARGIN.TOP,
    color: THEME.COLORS.PRIMARY,
  },
  separator: {
    height: 1,
    backgroundColor: THEME.COLORS.SEPARATOR,
    width: '80%',
    alignSelf: 'center',
    opacity: 0.8,
    marginVertical: THEME.SPACING.MARGIN.TOP,
  },
  previewImage: {
    width: THEME.IMAGE.SIZE,
    height: THEME.IMAGE.SIZE,
    alignSelf: 'center',
    borderRadius: THEME.BORDER.RADIUS.IMAGE,
  },
  foodItem: {
    padding: THEME.SPACING.PADDING,
    marginHorizontal: THEME.SPACING.MARGIN.HORIZONTAL,
    marginVertical: THEME.SPACING.MARGIN.VERTICAL,
    backgroundColor: THEME.COLORS.FOOD_ITEM,
    borderRadius: THEME.BORDER.RADIUS.BUTTON,
  },
  foodText: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT.SIZE.NORMAL,
  },
  errorText: {
    color: THEME.COLORS.ERROR,
    textAlign: 'center',
    marginVertical: THEME.SPACING.PADDING,
  },
});
