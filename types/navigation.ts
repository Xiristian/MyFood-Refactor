import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  '(tabs)': undefined;
  'description-screen': { mealId: number };
  camera: { id: string; date: string };
  'user-register': undefined;
  login: undefined;
  modal: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type TabParamList = {
  index: undefined;
  graphics: undefined;
  user: undefined;
};

export type ScreenParams = {
  id?: number;
  date?: Date;
  loadData?: () => Promise<void>;
};

export type NavigationProps = {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
  route: {
    params: ScreenParams;
  };
};
