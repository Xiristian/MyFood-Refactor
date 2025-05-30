import { StyleProp, ViewStyle, ImageStyle } from 'react-native';
import { Food } from '@/database/types';

export interface CommonProps {
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export interface FoodItemProps {
  food: Food;
  loadData: () => Promise<void>;
}

export interface FoodsProps {
  foods: Food[];
  loadData: () => Promise<void>;
}

export interface SearchBarProps {
  placeholder: string;
  onChangeText: (text: string) => void;
}

export interface LoginProps {
  onLogin: () => void;
}

export interface ImagePickerProps {
  setImage: React.Dispatch<React.SetStateAction<string>>;
  setFoods: React.Dispatch<React.SetStateAction<any[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  goBack: () => void;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ButtonProps {
  onPress: () => void;
}

export interface FormFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export interface FormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends FormData {
  image: string | null;
  name: string;
  age: string;
  height: string;
  currentWeight: string;
  targetWeight: string;
  confirmPassword: string;
  weight: string;
  goal: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}
