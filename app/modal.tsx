import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput, TouchableOpacity, View } from '@/components/Themed';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MealService } from '@/database/services/MealService';

// Types
interface RouteParams {
  loadData: () => Promise<void>;
}

// Constants
const THEME = {
  OVERLAY: {
    OPACITY: 0.9,
    BACKGROUND: {
      LIGHT: '#FFFCEB',
      DARK: '#3C3C3C',
    },
  },
  COLORS: {
    PRIMARY: '#547260',
    SECONDARY: '#76A689',
    TEXT: {
      LIGHT: '#FFFCEB',
      DARK: '#FFFFFF',
    },
  },
  MODAL: {
    WIDTH: 80,
    TOP_OFFSET: -10,
    HEIGHT: 300,
    BORDER_RADIUS: 30,
    BORDER_WIDTH: 5,
  },
};

// Custom Hooks
const useCreateMeal = (onMealCreated: () => Promise<void>) => {
  const [mealName, setMealName] = useState('');
  const mealService = MealService.getInstance();
  const navigation = useNavigation();

  const handleCreateMeal = async () => {
    if (!mealName.trim()) return;

    try {
      await mealService.createMeal({
        name: mealName,
        iconName: 'sunrise',
        position: 0
      });
      await onMealCreated();
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar refeição:', error);
    }
  };

  return {
    mealName,
    setMealName,
    handleCreateMeal,
  };
};

// Components
const Overlay: React.FC = () => (
  <View
    style={styles.overlay}
    lightColor={`rgba(0, 0, 0, ${THEME.OVERLAY.OPACITY})`}
    darkColor={`rgba(0, 0, 0, ${THEME.OVERLAY.OPACITY})`}
  />
);

const MealNameInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
}> = ({ value, onChangeText }) => (
  <TextInput
    style={styles.input}
    value={value}
    onChangeText={onChangeText}
    placeholder="Nome da refeição"
    placeholderTextColor={THEME.COLORS.TEXT.LIGHT}
  />
);

const CreateButton: React.FC<{
  onPress: () => void;
}> = ({ onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>Criar</Text>
  </TouchableOpacity>
);

const ModalContent: React.FC<{
  mealName: string;
  onMealNameChange: (text: string) => void;
  onSubmit: () => void;
}> = ({ mealName, onMealNameChange, onSubmit }) => (
  <View style={styles.modal} lightColor={THEME.OVERLAY.BACKGROUND.LIGHT} darkColor={THEME.OVERLAY.BACKGROUND.DARK}>
    <Text style={styles.title}>Nova Refeição</Text>
    <MealNameInput value={mealName} onChangeText={onMealNameChange} />
    <CreateButton onPress={onSubmit} />
  </View>
);

export default function CreateMealModal() {
  const route = useRoute<RouteProp<{ params: RouteParams }>>();
  const { loadData } = route.params;
  const { mealName, setMealName, handleCreateMeal } = useCreateMeal(loadData);

  return (
    <>
      <Overlay />
      <View style={styles.container}>
        <ModalContent
          mealName={mealName}
          onMealNameChange={setMealName}
          onSubmit={handleCreateMeal}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  modal: {
    height: THEME.MODAL.HEIGHT,
    width: `${THEME.MODAL.WIDTH}%`,
    top: `${THEME.MODAL.TOP_OFFSET}%`,
    borderColor: '#000',
    borderWidth: THEME.MODAL.BORDER_WIDTH,
    borderRadius: THEME.MODAL.BORDER_RADIUS,
    padding: 20,
    alignItems: 'center',
    paddingTop: '20%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.COLORS.PRIMARY,
    paddingBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: THEME.COLORS.PRIMARY,
    backgroundColor: THEME.COLORS.PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: THEME.COLORS.TEXT.DARK,
  },
  button: {
    height: 45,
    width: 150,
    borderRadius: 10,
    marginBottom: 5,
    marginTop: 45,
    backgroundColor: THEME.COLORS.SECONDARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: THEME.COLORS.TEXT.DARK,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
