import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Feather } from '@expo/vector-icons';
import { Meal } from '@/database/entities/meal-entity';
import { useDatabaseConnection } from '@/database/DatabaseConnection';
import { useFocusEffect, useNavigation } from 'expo-router';
import RenderFoods from '@/components/RenderFoods';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';

// Types
interface ItemMeal extends Meal {
  isExpanded?: boolean;
}

type RootStackParamList = {
  modal: any;
  camera: { id: number; date: Date; loadData: () => Promise<void> };
  'description-screen': { id: number; date: Date; loadData: () => Promise<void> };
};

// Constants
const INITIAL_MEALS: ItemMeal[] = [
  { id: 1, name: 'Desjejum', iconName: 'sunrise', order: 0, foods: [] },
  { id: 2, name: 'Café da manhã', iconName: 'coffee', order: 0, foods: [] },
  { id: 3, name: 'Almoço', iconName: 'sun', order: 0, foods: [] },
  { id: 4, name: 'Café da tarde', iconName: 'coffee', order: 0, foods: [] },
  { id: 5, name: 'Jantar', iconName: 'moon', order: 0, foods: [] },
];

// Custom Hook
const useMealData = (initialDate: Date) => {
  const [data, setData] = useState<ItemMeal[]>([]);
  const [date, setDate] = useState(initialDate);
  const { mealRepository } = useDatabaseConnection();

  const loadData = async () => {
    try {
      let meals = await mealRepository.findAll();
      if (!meals || meals.length === 0) {
        meals = await mealRepository.createMeals(INITIAL_MEALS);
      }
      meals = await mealRepository.findByDate(date);
      setData((prevData) => {
        return meals.map((meal, index) => ({
          ...meal,
          isExpanded: prevData[index]?.isExpanded,
        }));
      });
    } catch (error) {
      console.error('Erro ao carregar refeições:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [date]);

  const toggleExpansion = (id: number) => {
    setData((prevData) =>
      prevData.map((item) => ({
        ...item,
        isExpanded: item.id === id ? !item.isExpanded : item.isExpanded,
      }))
    );
  };

  return { data, date, setDate, loadData, toggleExpansion };
};

// Components
const MealIcon: React.FC<{ iconName: string }> = ({ iconName }) => {
  const iconMap = {
    sunrise: 'sunrise',
    coffee: 'coffee',
    sun: 'sun',
    moon: 'moon',
  };

  const iconName_ = iconMap[iconName as keyof typeof iconMap];
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

  const navigateToScreen = (screen: 'camera' | 'description-screen') => {
    navigation.navigate(screen, { id, date, loadData });
  };

  return (
    <View style={styles.expandedContent}>
      <View style={styles.expandedContentIconsRow} lightColor="#FFFCEB" darkColor="#3C3C3C">
        <TouchableOpacity onPress={() => navigateToScreen('camera')}>
          <View style={styles.iconWithText} lightColor="#FFFCEB" darkColor="#3C3C3C">
            <Feather name="camera" size={24} color="#76A689" style={styles.icon} />
            <Text style={styles.iconDescription}>Fotografar</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToScreen('description-screen')}>
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
  item: ItemMeal;
  date: Date;
  toggleExpansion: (id: number) => void;
  loadData: () => Promise<void>;
}> = ({ item, date, toggleExpansion, loadData }) => {
  return (
    <View lightColor="#FFFCEB" darkColor="#3C3C3C">
      <View style={styles.listItem} lightColor="#FFFCEB" darkColor="#3C3C3C">
        <MealIcon iconName={item.iconName} />
        <Text numberOfLines={1} style={styles.itemText}>
          {item.name}
        </Text>
        <TouchableOpacity onPress={() => toggleExpansion(item.id)}>
          <Feather
            name={item.isExpanded ? 'chevron-down' : 'chevron-right'}
            size={24}
            color="#76A689"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      {item.isExpanded && (
        <>
          <RenderFoods foods={item.foods} loadData={loadData} />
          <ExpandedActions id={item.id} date={date} loadData={loadData} />
        </>
      )}
    </View>
  );
};

const DateSelector: React.FC<{
  date: Date;
  setDate: (date: Date) => void;
}> = ({ date, setDate }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowCalendar(Platform.OS === 'ios');
    setDate(currentDate);
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
          onChange={onChange}
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
  const { data, date, setDate, loadData, toggleExpansion } = useMealData(new Date());

  return (
    <View style={styles.container} lightColor="#FFFCEB" darkColor="#3C3C3C">
      <View style={styles.header} lightColor="#FFFCEB" darkColor="#3C3C3C">
        <Text style={styles.title}>Minhas refeições</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('modal')}
        >
          <Feather name="plus" size={24} color="#76A689" />
        </TouchableOpacity>
      </View>
      
      <DateSelector date={date} setDate={setDate} />
      
      <View style={styles.listContainer} lightColor="#FFFCEB" darkColor="#3C3C3C">
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MealItem
              item={item}
              date={date}
              toggleExpansion={toggleExpansion}
              loadData={loadData}
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
