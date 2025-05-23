import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, TouchableOpacity, View } from '@/components/Themed';
import { Feather } from '@expo/vector-icons';
import SearchBar from '@/components/SearchBar';
import { router } from 'expo-router';
import { FAB } from 'react-native-paper';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useDatabaseConnection } from '@/database/DatabaseConnection';
import { FoodDTO, getFoods } from '@/backend/get-foods';
import { isTest } from '@/backend/test';

// Types
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
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.length === 0) {
      setSearchResults([]);
      return;
    }

    let page = searchPage;
    if (text !== searchText) {
      setLoading(true);
      page = 0;
      setSearchPage(0);
    }

    try {
      const result = await getFoods(text, page);
      if (page === 0 || isTest) {
        setSearchResults(result);
      } else {
        setSearchResults((prev) => [...prev, ...result]);
      }
    } catch (error) {
      console.error('Erro ao buscar alimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreResults = () => {
    setSearchPage((prev) => prev + 1);
  };

  return {
    searchResults,
    searchText,
    loading,
    handleSearch,
    loadMoreResults,
  };
};

const useSelectedItems = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return {
    selectedItems,
    toggleItemSelection,
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
      <Feather name="plus-circle" size={21} color="#547260" style={styles.icon} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onEdit}>
      <Feather name="edit" size={21} color="#547260" style={styles.icon} />
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
      <TouchableOpacity
        style={[styles.foodItem, isSelected && styles.selectedItem]}
        onPress={() => onSelectItem(item.food_id)}>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>{index + 1}</Text>
        </View>
        <FoodInfo item={item} />
        <ActionButtons
          onSelect={() => onSelectItem(item.food_id)}
          onEdit={handleEdit}
        />
      </TouchableOpacity>
    </>
  );
};

const AddButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <View style={styles.bottomButtons}>
    <View style={styles.buttonContainer}>
      <FAB
        style={styles.fab}
        icon={() => <Feather name="plus" size={24} color="white" />}
        onPress={onPress}
      />
    </View>
  </View>
);

export default function DescriptionScreen() {
  const route = useRoute<RouteProp<{ params: RouteParams }>>();
  const { id: mealId, date, loadData } = route.params;
  const { mealRepository } = useDatabaseConnection();
  const { searchResults, loading, handleSearch, loadMoreResults } = useSearchFood();
  const { selectedItems, toggleItemSelection } = useSelectedItems();

  const handleAddItems = async () => {
    if (selectedItems.length === 0) return;

    try {
      const selectedFoods = searchResults.filter((food) =>
        selectedItems.includes(food.food_id)
      );

      await Promise.all(
        selectedFoods.map((food) =>
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
      router.back();
    } catch (error) {
      console.error('Erro ao adicionar alimentos:', error);
    }
  };

  return (
    <View style={styles.container} darkColor="#3C3C3C" lightColor="#FFFCEB">
      <Text style={styles.title} darkColor="#547260" lightColor="#547260">
        Adicionar Alimentos
      </Text>
      
      <SearchBar placeholder="Digite um alimento" onChangeText={handleSearch} />
      
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.food_id}
        onEndReached={loadMoreResults}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
        renderItem={({ item, index }) => (
          <FoodCard
            item={item}
            index={index}
            onSelectItem={toggleItemSelection}
            isSelected={selectedItems.includes(item.food_id)}
          />
        )}
      />
      
      <AddButton onPress={handleAddItems} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
    color: '#547260',
  },
  separator: {
    height: 1,
    width: '80%',
    alignSelf: 'center',
    opacity: 0.8,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedItem: {
    borderColor: '#76A689',
  },
  numberContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  numberText: {
    color: '#547260',
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    color: '#547260',
    fontSize: 18,
    fontWeight: 'bold',
  },
  foodDetails: {
    color: '#547260',
    marginTop: 5,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
    opacity: 0.8,
  },
  bottomButtons: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  fab: {
    backgroundColor: '#344e41',
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
