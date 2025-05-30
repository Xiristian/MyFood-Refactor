import React, { useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { Text, TouchableOpacity, View } from '@/components/Themed';
import { Feather } from '@expo/vector-icons';
import SearchBar from '@/components/SearchBar';
import { router } from 'expo-router';
import { FAB } from 'react-native-paper';
import { RouteProp, useRoute } from '@react-navigation/native';
import { FoodDTO, getFoods } from '@/backend/get-foods';
import { isTest } from '@/backend/test';
import { MealService } from '@/database/services/MealService';
import { THEME } from '@/constants/theme';

interface RouteParams {
  id: number;
  date: Date;
  loadData: () => Promise<void>;
}

interface FoodCardProps {
  item: FoodDTO;
  index: number;
  onSelectItem: (id: string) => void;
  isSelected: boolean;
}

// Custom Hooks
const useSearchFood = () => {
  const [searchResults, setSearchResults] = useState<FoodDTO[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchPage, setSearchPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.length === 0) {
      setSearchResults([]);
      return;
    }

    let currentPage = searchPage;
    if (text !== searchText) {
      setIsLoading(true);
      currentPage = 0;
      setSearchPage(0);
    }

    try {
      const result = await getFoods(text, currentPage);
      if (currentPage === 0 || isTest) {
        setSearchResults(result);
      } else {
        setSearchResults((prevResults) => [...prevResults, ...result]);
      }
    } catch (error) {
      console.error('Erro ao buscar alimentos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreResults = () => {
    setSearchPage((prevPage) => prevPage + 1);
  };

  return {
    searchResults,
    isLoading,
    handleSearch,
    loadMoreResults,
  };
};

const useSelectedItems = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prevItems) =>
      prevItems.includes(id) ? prevItems.filter((item) => item !== id) : [...prevItems, id],
    );
  };

  return {
    selectedItems,
    toggleItemSelection,
  };
};

const useMealService = (mealId: number, date: Date, onSuccess: () => Promise<void>) => {
  const mealService = MealService.getInstance();

  const addFoodsToMeal = async (selectedFoods: FoodDTO[]) => {
    try {
      await Promise.all(
        selectedFoods.map((food) =>
          mealService.addFoodToMeal(mealId, {
            name: food.food_name,
            calories: food.calories,
            mealId: mealId,
            date: date,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
          }),
        ),
      );
      await onSuccess();
      router.back();
    } catch (error) {
      console.error('Erro ao adicionar alimentos:', error);
    }
  };

  return {
    addFoodsToMeal,
  };
};

// Components
const FoodInfo: React.FC<{ item: FoodDTO }> = ({ item }) => (
  <View style={styles.foodInfo}>
    <Text style={styles.foodName}>{item.food_name}</Text>
    <Text style={styles.foodDetails}>Calorias: {item.calories}</Text>
    <Text style={styles.foodDetails}>Quantidade: {item.quantity}</Text>
    <Text style={styles.foodDetails}>Unidade: {item.unit}</Text>
  </View>
);

const ActionButtons: React.FC<{
  onSelect: () => void;
  onEdit: () => void;
}> = ({ onSelect, onEdit }) => (
  <View style={styles.iconsContainer}>
    <TouchableOpacity onPress={onSelect}>
      <Feather name="plus-circle" size={21} color={THEME.COLORS.ICON} style={styles.icon} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onEdit}>
      <Feather name="edit" size={21} color={THEME.COLORS.ICON} style={styles.icon} />
    </TouchableOpacity>
  </View>
);

const FoodCard: React.FC<FoodCardProps> = ({ item, index, onSelectItem, isSelected }) => {
  const handleEdit = () => {
    console.log(`Editar ${item.food_name}`);
  };

  return (
    <>
      <View style={styles.separator} darkColor="#333333" lightColor="#E3E3E3" />
      <Pressable
        style={[styles.foodItem, isSelected && styles.selectedItem]}
        onPress={() => onSelectItem(item.food_id)}>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{index + 1}</Text>
        </View>
        <FoodInfo item={item} />
        <ActionButtons onSelect={() => onSelectItem(item.food_id)} onEdit={handleEdit} />
      </Pressable>
    </>
  );
};

const PlusIcon = () => <Feather name="plus" size={24} color="white" />;

const AddButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <View style={styles.bottomButtons}>
    <View style={styles.buttonContainer}>
      <FAB style={styles.fab} icon={PlusIcon} onPress={onPress} />
    </View>
  </View>
);

const LoadingIndicator: React.FC = () => (
  <ActivityIndicator size="large" color={THEME.COLORS.PRIMARY} />
);

export default function DescriptionScreen() {
  const route = useRoute<RouteProp<{ params: RouteParams }>>();
  const { id: mealId, date, loadData } = route.params;
  const { searchResults, isLoading, handleSearch, loadMoreResults } = useSearchFood();
  const { selectedItems, toggleItemSelection } = useSelectedItems();
  const { addFoodsToMeal } = useMealService(mealId, date, loadData);

  const handleAddSelectedFoods = async () => {
    if (selectedItems.length === 0) return;

    const selectedFoods = searchResults.filter((food) => selectedItems.includes(food.food_id));

    await addFoodsToMeal(selectedFoods);
  };

  return (
    <View
      style={styles.container}
      darkColor={THEME.COLORS.BACKGROUND.DARK}
      lightColor={THEME.COLORS.BACKGROUND.LIGHT}>
      <Text style={styles.title}>Adicionar Alimentos</Text>

      <SearchBar placeholder="Digite um alimento" onChangeText={handleSearch} />

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.food_id}
        onEndReached={loadMoreResults}
        ListFooterComponent={isLoading ? <LoadingIndicator /> : null}
        renderItem={({ item, index }) => (
          <FoodCard
            item={item}
            index={index}
            onSelectItem={toggleItemSelection}
            isSelected={selectedItems.includes(item.food_id)}
          />
        )}
      />

      <AddButton onPress={handleAddSelectedFoods} />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.SPACING.MARGIN.BOTTOM,
    paddingHorizontal: THEME.SPACING.PADDING.HORIZONTAL,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  container: {
    flex: 1,
  },
  fab: {
    backgroundColor: THEME.COLORS.FAB,
    bottom: 0,
    margin: 16,
    position: 'absolute',
    right: 0,
  },
  foodDetails: {
    color: THEME.COLORS.PRIMARY,
    marginTop: THEME.SPACING.MARGIN.VERTICAL,
  },
  foodInfo: {
    flex: 1,
  },
  foodItem: {
    alignItems: 'center',
    borderColor: THEME.COLORS.BORDER.TRANSPARENT,
    borderRadius: THEME.INPUT.BORDER_RADIUS,
    borderWidth: THEME.BORDER.WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: THEME.SPACING.MARGIN.HORIZONTAL,
    marginTop: THEME.SPACING.MARGIN.TOP,
    paddingHorizontal: THEME.SPACING.PADDING.HORIZONTAL,
    paddingVertical: THEME.SPACING.PADDING.VERTICAL,
  },
  foodName: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT.SIZE.FOOD_NAME,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: THEME.SPACING.MARGIN.HORIZONTAL,
    opacity: 0.8,
  },
  iconsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  numberContainer: {
    alignItems: 'center',
    marginRight: THEME.SPACING.MARGIN.HORIZONTAL,
  },
  numberText: {
    color: THEME.COLORS.TEXT.DARK,
    fontSize: THEME.FONT.SIZE.NUMBER,
    fontWeight: 'bold',
  },
  selectedItem: {
    borderColor: THEME.COLORS.BORDER.SELECTED,
  },
  separator: {
    alignSelf: 'center',
    height: 1,
    opacity: 0.8,
    width: '80%',
  },
  title: {
    color: THEME.COLORS.TEXT.DARK,
    fontSize: THEME.FONT.SIZE.TITLE,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.MARGIN.TOP,
    marginTop: 20,
    textAlign: 'center',
  },
});
