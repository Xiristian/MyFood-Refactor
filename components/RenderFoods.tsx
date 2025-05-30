import { StyleSheet } from 'react-native';
import { View } from './Themed';
import RenderFoodItem from './RenderFoodItem';
import { Food } from '@/database/types';

interface RenderFoodsProps {
  foods: Food[];
  loadData: () => Promise<void>;
}

export default function RenderFoods({ foods, loadData }: RenderFoodsProps) {
  return (
    <View style={styles.container}>
      {foods.map((food) => (
        <RenderFoodItem key={food.id} food={food} loadData={loadData} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    width: '100%',
  },
});
