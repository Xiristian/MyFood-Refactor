import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from 'expo-router';
import RenderFoods from '@/components/RenderFoods';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';
import { MealService } from '@/database/services/MealService';
import { Food, ItemMeal } from '@/database/types';

// Types
type RootStackParamList = {
  modal: { loadData: () => Promise<void> };
  camera: { id: number; date: Date; loadData: () => Promise<void> };
  'description-screen': { id: number; date: Date; loadData: () => Promise<void> };
};

// Constants
const DEFAULT_MEALS = [
  { name: 'Desjejum', iconName: 'sunrise', position: 0 },
  { name: 'Café da manhã', iconName: 'coffee', position: 1 },
  { name: 'Almoço', iconName: 'sun', position: 2 },
  { name: 'Café da tarde', iconName: 'coffee', position: 3 },
  { name: 'Jantar', iconName: 'moon', position: 4 },
];

const ICON_MAP = {
  sunrise: 'sunrise',
  coffee: 'coffee',
  sun: 'sun',
  moon: 'moon',
} as const;

// Custom Hooks
const useMealData = (initialDate: Date) => {
  const [meals, setMeals] = useState<ItemMeal[]>([]);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const mealService = MealService.getInstance();

  const loadMeals = async () => {
    try {
      await mealService.initializeDefaultMeals(DEFAULT_MEALS);
      const mealsWithFoods = await mealService.getMealsWithFoods(selectedDate);

      setMeals(prevMeals => {
        return mealsWithFoods.map((meal, index) => ({
          ...meal,
          isExpanded: prevMeals[index]?.isExpanded,
        }));
      });
    } catch (error) {
      console.error('Erro ao carregar refeições:', error);
    }
  };

  useEffect(() => {
    loadMeals();
  }, [selectedDate]);

  const toggleMealExpansion = (id: number) => {
    setMeals(prevMeals =>
      prevMeals.map(meal => ({
        ...meal,
        isExpanded: meal.id === id ? !meal.isExpanded : meal.isExpanded,
      }))
    );
  };

  return {
    meals,
    selectedDate,
    setSelectedDate,
    loadMeals,
    toggleMealExpansion,
  };
};

// Components
const MealIcon: React.FC<{ iconName: string }> = ({ iconName }) => {
  const iconName_ = ICON_MAP[iconName as keyof typeof ICON_MAP];
  return iconName_ ? (
    <Feather name={iconName_ as any} size={24} color="#76A689" style={styles.icon} />
  ) : null;
};

const ExpandedActions: React.FC<{
  id: number;
  date: Date;
  loadData: () => Promise<void>;
}> = ({ id, date, loadData }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNavigate = (screen: 'camera' | 'description-screen') => {
    navigation.navigate(screen, { id, date, loadData });
  };

  return (
    <View style={styles.expandedContent}>
      <View style={styles.expandedContentIconsRow} lightColor="#FFFCEB" darkColor="#3C3C3C">
        <TouchableOpacity onPress={() => handleNavigate('camera')}>
          <View style={styles.iconWithText} lightColor="#FFFCEB" darkColor="#3C3C3C">
            <Feather name="camera" size={24} color="#76A689" style={styles.icon} />
            <Text style={styles.iconDescription}>Fotografar</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigate('description-screen')}>
          <View style={styles.iconWithText} lightColor="#FFFCEB" darkColor="#3C3C3C">
            <Feather name="edit" size={24} color="#76A689" style={styles.icon} />
            <Text style={styles.iconDescription}>Descrever</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const MealItem: React.FC<{
  meal: ItemMeal;
  date: Date;
  onToggleExpansion: (id: number) => void;
  loadData: () => Promise<void>;
}> = ({ meal, date, onToggleExpansion, loadData }) => {
  return (
    <View lightColor="#FFFCEB" darkColor="#3C3C3C">
      <View style={styles.listItem} lightColor="#FFFCEB" darkColor="#3C3C3C">
        <MealIcon iconName={meal.iconName} />
        <Text numberOfLines={1} style={styles.itemText}>
          {meal.name}
        </Text>
        <TouchableOpacity onPress={() => onToggleExpansion(meal.id)}>
          <Feather
            name={meal.isExpanded ? 'chevron-down' : 'chevron-right'}
            size={24}
            color="#76A689"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      {meal.isExpanded && (
        <>
          <RenderFoods foods={meal.foods || []} loadData={loadData} />
          <ExpandedActions id={meal.id} date={date} loadData={loadData} />
        </>
      )}
    </View>
  );
};

const DateSelector: React.FC<{
  date: Date;
  onDateChange: (date: Date) => void;
}> = ({ date, onDateChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowCalendar(Platform.OS === 'ios');
    onDateChange(currentDate);
  };

  return (
    <TouchableOpacity
      onPress={() => setShowCalendar(true)}
      style={styles.datePickerButton}
    >
      {Platform.OS !== 'ios' && (
        <Text style={styles.dateText}>{moment(date).format('DD/MM/yyyy')}</Text>
      )}
      {(showCalendar || Platform.OS === 'ios') && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          display="default"
          onChange={handleDateChange}
          accentColor="#547260"
          locale="pt-BR"
        />
      )}
      <Feather name="calendar" size={24} color="#76A689" style={styles.calendarIcon} />
    </TouchableOpacity>
  );
};

export default function MealsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { meals, selectedDate, setSelectedDate, loadMeals, toggleMealExpansion } = useMealData(new Date());

  const handleNavigateToModal = () => {
    navigation.navigate('modal', { loadData: loadMeals });
  };

  return (
    <View style={styles.container} lightColor="#FFFCEB" darkColor="#3C3C3C">
      <View style={styles.header} lightColor="#FFFCEB" darkColor="#3C3C3C">
        <Text style={styles.title}>Minhas refeições</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleNavigateToModal}
        >
          <Feather name="plus" size={24} color="#76A689" />
        </TouchableOpacity>
      </View>
      
      <DateSelector date={selectedDate} onDateChange={setSelectedDate} />
      
      <View style={styles.listContainer} lightColor="#FFFCEB" darkColor="#3C3C3C">
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MealItem
              meal={item}
              date={selectedDate}
              onToggleExpansion={toggleMealExpansion}
              loadData={loadMeals}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#547260',
    marginBottom: 10,
    marginTop: 20,
  },
  addButton: {
    marginLeft: 10,
    marginTop: 5,
  },
  listContainer: {
    flexGrow: 1,
    width: '90%',
    marginHorizontal: '5%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#76A689',
  },
  itemText: {
    marginLeft: 10,
    fontSize: 18,
    flex: 1,
    color: '#547260',
  },
  icon: {
    marginRight: 10,
  },
  expandedContent: {
    marginTop: 10,
    width: '70%',
  },
  expandedContentIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  iconWithText: {
    alignItems: 'center',
  },
  iconDescription: {
    color: '#547260',
    fontSize: 12,
    marginTop: 5,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#FFFCEB',
    borderRadius: 5,
  },
  dateText: {
    marginRight: 10,
    color: '#547260',
    fontSize: 16,
  },
  calendarIcon: {
    marginLeft: 5,
  },
});
