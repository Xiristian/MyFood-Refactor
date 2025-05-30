import React, { useState } from 'react';
import { StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, TextInput, TouchableOpacity, View } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native';
import { MealService } from '@/database/services/MealService';
import { THEME } from '@/constants/theme';
import { EventEmitter } from '@/utils/EventEmitter';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const MEAL_ICONS = [
  { name: 'sunrise', label: 'Café da Manhã' },
  { name: 'sun', label: 'Almoço' },
  { name: 'sunset', label: 'Café da Tarde' },
  { name: 'moon', label: 'Jantar' },
  { name: 'coffee', label: 'Lanche' },
];

interface MealPosition {
  label: string;
  value: number;
}

const MEAL_POSITIONS: MealPosition[] = MEAL_ICONS.map((icon, index) => ({
  label: icon.label,
  value: index,
}));

// Custom Hooks
const useCreateMeal = () => {
  const [mealName, setMealName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('sunrise');
  const [selectedPosition, setSelectedPosition] = useState(0);
  const mealService = MealService.getInstance();
  const navigation = useNavigation();

  const handleCreateMeal = async () => {
    if (!mealName.trim()) return;

    try {
      await mealService.createMeal({
        name: mealName,
        iconName: selectedIcon,
        position: selectedPosition,
      });
      EventEmitter.emit('mealCreated');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar refeição:', error);
    }
  };

  return {
    mealName,
    setMealName,
    selectedIcon,
    setSelectedIcon,
    selectedPosition,
    setSelectedPosition,
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

const IconSelector: React.FC<{
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
}> = ({ selectedIcon, onSelectIcon }) => (
  <View style={styles.iconSelector}>
    <Text style={styles.sectionTitle}>Ícone</Text>
    <FlatList
      data={MEAL_ICONS}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.iconItem, selectedIcon === item.name && styles.selectedIcon]}
          onPress={() => onSelectIcon(item.name)}>
          <Feather
            name={item.name as any}
            size={24}
            color={selectedIcon === item.name ? THEME.COLORS.PRIMARY : THEME.COLORS.SECONDARY}
          />
        </TouchableOpacity>
      )}
    />
  </View>
);

const PositionSelector: React.FC<{
  selectedPosition: number;
  onSelectPosition: (position: number) => void;
}> = ({ selectedPosition, onSelectPosition }) => (
  <View style={styles.positionSelector}>
    <Text style={styles.sectionTitle}>Horário da Refeição</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {MEAL_POSITIONS.map((position) => (
        <TouchableOpacity
          key={position.value}
          style={[styles.positionItem, selectedPosition === position.value && styles.selectedPosition]}
          onPress={() => onSelectPosition(position.value)}>
          <Text
            style={[
              styles.positionText,
              selectedPosition === position.value && styles.selectedPositionText,
            ]}>
            {position.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const ModalContent: React.FC<{
  mealName: string;
  setMealName: (name: string) => void;
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  selectedPosition: number;
  setSelectedPosition: (position: number) => void;
  handleCreateMeal: () => Promise<void>;
}> = ({
  mealName,
  setMealName,
  selectedIcon,
  setSelectedIcon,
  selectedPosition,
  setSelectedPosition,
  handleCreateMeal,
}) => (
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
    <IconSelector selectedIcon={selectedIcon} onSelectIcon={setSelectedIcon} />
    <PositionSelector selectedPosition={selectedPosition} onSelectPosition={setSelectedPosition} />
    <TouchableOpacity style={styles.button} onPress={handleCreateMeal}>
      <Text style={styles.buttonText}>Criar</Text>
    </TouchableOpacity>
  </View>
);

export default function CreateMealModal() {
  const {
    mealName,
    setMealName,
    selectedIcon,
    setSelectedIcon,
    selectedPosition,
    setSelectedPosition,
    handleCreateMeal,
  } = useCreateMeal();

  return (
    <>
      <Overlay />
      <View style={styles.container}>
        <ModalContent
          mealName={mealName}
          setMealName={setMealName}
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
          selectedPosition={selectedPosition}
          setSelectedPosition={setSelectedPosition}
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
  iconItem: {
    alignItems: 'center',
    borderColor: THEME.COLORS.SECONDARY,
    borderRadius: THEME.BORDER.RADIUS.BUTTON,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    marginHorizontal: 5,
    width: 40,
  },
  iconSelector: {
    marginTop: 20,
    width: '100%',
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
    height: THEME.MODAL.HEIGHT + 100,
    padding: THEME.SPACING.PADDING.VERTICAL,
    paddingTop: '10%',
    top: `${THEME.MODAL.TOP_OFFSET - 10}%`,
    width: `${THEME.MODAL.WIDTH}%`,
  },
  overlay: {
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  positionItem: {
    alignItems: 'center',
    borderColor: THEME.COLORS.SECONDARY,
    borderRadius: THEME.BORDER.RADIUS.BUTTON,
    borderWidth: 1,
    justifyContent: 'center',
    marginHorizontal: 5,
    padding: 10,
  },
  positionSelector: {
    marginTop: 20,
    width: '100%',
  },
  positionText: {
    color: THEME.COLORS.SECONDARY,
    fontSize: THEME.FONT.SIZE.NORMAL,
  },
  sectionTitle: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT.SIZE.SUBTITLE,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: THEME.SPACING.PADDING.HORIZONTAL,
  },
  selectedIcon: {
    borderColor: THEME.COLORS.PRIMARY,
    backgroundColor: THEME.COLORS.BACKGROUND.LIGHT,
  },
  selectedPosition: {
    borderColor: THEME.COLORS.PRIMARY,
    backgroundColor: THEME.COLORS.BACKGROUND.LIGHT,
  },
  selectedPositionText: {
    color: THEME.COLORS.PRIMARY,
  },
  title: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT.SIZE.TITLE,
    fontWeight: 'bold',
    paddingBottom: THEME.SPACING.PADDING.VERTICAL,
  },
});
