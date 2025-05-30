import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TextInput, TouchableOpacity, View } from '@/components/Themed';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MealService } from '@/database/services/MealService';
import { THEME } from '@/constants/theme';

// Types
interface RouteParams {
  loadData: () => Promise<void>;
}

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
        position: 0,
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

const ModalContent: React.FC<{
  mealName: string;
  setMealName: (name: string) => void;
  handleCreateMeal: () => Promise<void>;
}> = ({ mealName, setMealName, handleCreateMeal }) => (
  <View
    style={styles.modal}
    lightColor={THEME.COLORS.BACKGROUND.LIGHT}
    darkColor={THEME.COLORS.BACKGROUND.DARK}>
    <Text style={styles.title}>Nova Refeição</Text>
    <TextInput
      style={styles.input}
      placeholder="Nome da refeição"
      placeholderTextColor={THEME.COLORS.TEXT.LIGHT}
      value={mealName}
      onChangeText={setMealName}
    />
    <TouchableOpacity style={styles.button} onPress={handleCreateMeal}>
      <Text style={styles.buttonText}>Criar</Text>
    </TouchableOpacity>
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
          setMealName={setMealName}
          handleCreateMeal={handleCreateMeal}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: THEME.COLORS.SECONDARY,
    borderRadius: THEME.BORDER.RADIUS.BUTTON,
    height: 45,
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: THEME.SPACING.MARGIN.TOP,
    width: 150,
  },
  buttonText: {
    color: THEME.COLORS.TEXT.LIGHT,
    fontSize: THEME.FONT.SIZE.NORMAL,
    fontWeight: 'bold',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: THEME.COLORS.SECONDARY,
    borderColor: THEME.COLORS.PRIMARY,
    borderRadius: THEME.INPUT.BORDER_RADIUS,
    borderWidth: THEME.BORDER.WIDTH,
    color: THEME.COLORS.TEXT.LIGHT,
    height: THEME.INPUT.HEIGHT,
    paddingHorizontal: THEME.SPACING.PADDING.HORIZONTAL,
    width: '100%',
  },
  modal: {
    alignItems: 'center',
    borderColor: THEME.COLORS.PRIMARY,
    borderRadius: THEME.MODAL.BORDER_RADIUS,
    borderWidth: THEME.MODAL.BORDER_WIDTH,
    height: THEME.MODAL.HEIGHT,
    padding: THEME.SPACING.PADDING.VERTICAL,
    paddingTop: '20%',
    top: `${THEME.MODAL.TOP_OFFSET}%`,
    width: `${THEME.MODAL.WIDTH}%`,
  },
  overlay: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  title: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT.SIZE.TITLE,
    fontWeight: 'bold',
    paddingBottom: THEME.SPACING.PADDING.VERTICAL,
  },
});
