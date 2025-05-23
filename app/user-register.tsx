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
import { login, register } from '@/backend/user';
import { useDatabaseConnection } from '@/database/DatabaseConnection';
import { useNavigation } from 'expo-router';

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
    } = formData;

    if (
      !name ||
      !age ||
      !height ||
      !currentWeight ||
      !targetWeight ||
      !password ||
      !confirmPassword ||
      !email
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
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric';
  secureTextEntry?: boolean;
}> = ({ label, value, onChangeText, keyboardType = 'default', secureTextEntry }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const RegisterPage: React.FC<RegisterPageProps> = ({ onLogin }) => {
  const navigation = useNavigation();
  const { userRepository } = useDatabaseConnection();
  const { formData, updateFormField, validateForm } = useRegisterForm();

  const handleRegister = async () => {
    try {
      validateForm();

      await register({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        age: parseInt(formData.age),
        goal: parseFloat(formData.targetWeight),
        weight: parseFloat(formData.currentWeight),
        height: parseFloat(formData.height),
      });

      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      if (response?.name) {
        await userRepository.create(response);
        onLogin ? onLogin() : navigation.goBack();
      } else {
        Alert.alert('Erro', 'Credenciais inválidas. Por favor, tente novamente.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Algo deu errado. Por favor, tente novamente mais tarde.';
      Alert.alert('Erro', message);
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
            label="Nome"
            value={formData.name}
            onChangeText={(text) => updateFormField('name', text)}
          />

          <View style={[styles.row]} lightColor="#FFFCEB" darkColor="#3C3C3C">
            <View style={styles.halfWidthContainer}>
              <FormInput
                label="Idade"
                value={formData.age}
                onChangeText={(text) => updateFormField('age', text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfWidthContainer}>
              <FormInput
                label="Altura (cm)"
                value={formData.height}
                onChangeText={(text) => updateFormField('height', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={[styles.row]} lightColor="#FFFCEB" darkColor="#3C3C3C">
            <View style={styles.halfWidthContainer}>
              <FormInput
                label="Peso Atual (kg)"
                value={formData.currentWeight}
                onChangeText={(text) => updateFormField('currentWeight', text)}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfWidthContainer}>
              <FormInput
                label="Peso Meta (kg)"
                value={formData.targetWeight}
                onChangeText={(text) => updateFormField('targetWeight', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <FormInput
            label="E-Mail"
            value={formData.email}
            onChangeText={(text) => updateFormField('email', text)}
          />

          <FormInput
            label="Senha"
            value={formData.password}
            onChangeText={(text) => updateFormField('password', text)}
            secureTextEntry
          />

          <FormInput
            label="Confirmar Senha"
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
  label: {
    color: '#FFF',
    marginBottom: 5,
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
