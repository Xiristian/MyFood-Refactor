import { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import LoginButton from '../components/loginButton';
import { useDatabaseConnection } from '@/database/DatabaseConnection';
import Logo from '../components/Logo';
import { login } from '@/backend/user';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { Text, TextInput, TouchableOpacity, View } from '@/components/Themed';

// Types
interface LoginPageProps {
  onLogin: () => void;
}

type RootStackParamList = {
  'user-register': LoginPageProps;
};

interface LoginFormData {
  email: string;
  password: string;
}

// Custom Hook
const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const updateFormField = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    formData,
    updateFormField,
  };
};

// Components
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

const RegisterLink: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('user-register', { onLogin })}>
      <Text style={styles.text}>
        Não tem cadastro ainda?
        <Text style={styles.underline}> Cadastre-se</Text>
      </Text>
    </TouchableOpacity>
  );
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { userRepository } = useDatabaseConnection();
  const { formData, updateFormField } = useLoginForm();

  const handleLogin = async () => {
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      if (response?.email) {
        await userRepository.create(response);
        onLogin();
      } else {
        Alert.alert('Erro', 'Credenciais inválidas. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Algo deu errado. Por favor, tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.container} lightColor="#FFFCEB" darkColor="#3C3C3C">
      <Logo />
      <View style={styles.formContainer}>
        <FormInput
          placeholder="E-mail"
          value={formData.email}
          onChangeText={(text) => updateFormField('email', text)}
        />
        <FormInput
          placeholder="Senha"
          value={formData.password}
          onChangeText={(text) => updateFormField('password', text)}
          secureTextEntry
        />
      </View>
      <LoginButton onPress={handleLogin} />
      <RegisterLink onLogin={onLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    paddingHorizontal: '5%',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 45,
    borderRadius: 10,
    backgroundColor: '#76A689',
    color: '#FFFCEB',
    paddingLeft: 10,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#000',
  },
  underline: {
    textDecorationLine: 'underline',
    color: '#76A689',
  },
});

export default LoginPage;
