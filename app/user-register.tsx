import React, { useState } from 'react';
import {
  StyleSheet,
  Alert,
  Pressable,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Text, View, TextInput } from '@/components/Themed';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { register, UserDTO } from '@/backend/user';
import { useNavigation } from 'expo-router';
import { AuthService } from '@/database/services/AuthService';

// Types
interface RegisterPageProps {
  onLogin: () => void;
}

interface RegisterFormData {
  image: string | null;
  email: string;
  name: string;
  age: string;
  height: string;
  currentWeight: string;
  targetWeight: string;
  password: string;
  confirmPassword: string;
  weight: string;
  goal: string;
}

// Custom Hooks
const useRegisterForm = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    image: null,
    email: '',
    name: '',
    age: '',
    height: '',
    currentWeight: '',
    targetWeight: '',
    password: '',
    confirmPassword: '',
    weight: '',
    goal: '',
  });

  const updateFormField = (field: keyof RegisterFormData, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const {
      name,
      age,
      height,
      currentWeight,
      targetWeight,
      password,
      confirmPassword,
      email,
      weight,
      goal,
    } = formData;

    if (
      !name ||
      !age ||
      !height ||
      !currentWeight ||
      !targetWeight ||
      !password ||
      !confirmPassword ||
      !email ||
      !weight ||
      !goal
    ) {
      throw new Error('Por favor, preencha todos os campos.');
    }

    if (password !== confirmPassword) {
      throw new Error('As senhas não coincidem. Por favor, tente novamente.');
    }
  };

  return {
    formData,
    updateFormField,
    validateForm,
  };
};

// Components
const ImageSelector: React.FC<{
  image: string | null;
  onImageSelect: (uri: string | null) => void;
}> = ({ image, onImageSelect }) => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImageSelect(result.assets[0].uri);
    }
  };

  return (
    <Pressable style={styles.imageContainer} onPress={pickImage}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <FontAwesome name="camera" size={40} color="#547260" />
      )}
    </Pressable>
  );
};

const FormInput: React.FC<{
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}> = ({ placeholder, value, onChangeText, secureTextEntry }) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#FFFCEB"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const RegisterPage: React.FC<RegisterPageProps> = ({ onLogin }) => {
  const navigation = useNavigation();
  const authService = AuthService.getInstance();
  const { formData, updateFormField, validateForm } = useRegisterForm();

  const handleRegister = async () => {
    try {
      validateForm();

      const userData: UserDTO = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        goal: parseInt(formData.goal),
      };

      const response = await register(userData);

      if (response === 'Sucesso ao cadastrar!') {
        await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          image: formData.image || undefined
        });
        
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
        navigation.goBack();
        onLogin();
      } else {
        Alert.alert('Erro', response);
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
      Alert.alert('Erro', 'Algo deu errado. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container} lightColor="#FFFCEB" darkColor="#3C3C3C">
          <ImageSelector
            image={formData.image}
            onImageSelect={(uri) => updateFormField('image', uri)}
          />

          <FormInput
            placeholder="Nome"
            value={formData.name}
            onChangeText={(text) => updateFormField('name', text)}
          />

          <View style={[styles.row]} lightColor="#FFFCEB" darkColor="#3C3C3C">
            <View style={styles.halfWidthContainer}>
              <FormInput
                placeholder="Idade"
                value={formData.age}
                onChangeText={(text) => updateFormField('age', text)}
              />
            </View>
            <View style={styles.halfWidthContainer}>
              <FormInput
                placeholder="Altura (cm)"
                value={formData.height}
                onChangeText={(text) => updateFormField('height', text)}
              />
            </View>
          </View>

          <View style={[styles.row]} lightColor="#FFFCEB" darkColor="#3C3C3C">
            <View style={styles.halfWidthContainer}>
              <FormInput
                placeholder="Peso (kg)"
                value={formData.weight}
                onChangeText={(text) => updateFormField('weight', text)}
              />
            </View>
            <View style={styles.halfWidthContainer}>
              <FormInput
                placeholder="Meta de Peso (kg)"
                value={formData.goal}
                onChangeText={(text) => updateFormField('goal', text)}
              />
            </View>
          </View>

          <FormInput
            placeholder="E-Mail"
            value={formData.email}
            onChangeText={(text) => updateFormField('email', text)}
          />

          <FormInput
            placeholder="Senha"
            value={formData.password}
            onChangeText={(text) => updateFormField('password', text)}
            secureTextEntry
          />

          <FormInput
            placeholder="Confirmar Senha"
            value={formData.confirmPassword}
            onChangeText={(text) => updateFormField('confirmPassword', text)}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>CADASTRAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#547260',
    backgroundColor: '#547260',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#FFF',
  },
  halfWidthContainer: {
    width: '48%',
  },
  button: {
    height: 45,
    width: 150,
    borderRadius: 15,
    marginBottom: 5,
    marginTop: 30,
    backgroundColor: '#76A689',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 20,
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#76A689',
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 50,
  },
});

export default RegisterPage;
