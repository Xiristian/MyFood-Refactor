import axios from 'axios';
import * as fs from 'expo-file-system';
import { isTest } from './test';
import { FoodDTO, FoodsDTO, test } from './get-foods';

const getRandomFoods = (foods: FoodDTO[], min: number, max: number): FoodDTO[] => {
  const quantity = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...foods].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, quantity);
};

export const readFoodsFromImage = async (uri: string): Promise<FoodDTO[]> => {
  if (isTest) return getRandomFoods(test.foods, 2, 5);
  try {
    const image = await fs.readAsStringAsync(uri, {
      encoding: fs.EncodingType.Base64,
    });

    const { data }: { data: FoodsDTO } = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/read-foods-from-image`,
      { image },
      { timeout: 20000 },
    );

    return data.foods;
  } catch (error) {
    console.error(error);
    return [];
  }
};