import { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import LoginButton from '../components/loginButton';
import Logo from '../components/Logo';
import { login, UserDTO } from '@/backend/user';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { Text, TextInput, TouchableOpacity, View } from '@/components/Themed';
import { AuthService } from '@/database/services/AuthService';
import { User } from '@/database/types';

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

// Constants
const THEME = {
  COLORS: {
    PRIMARY: '#547260',
    SECONDARY: '#76A689',
    BACKGROUND: {
      LIGHT: '#FFFCEB',
      DARK: '#3C3C3C',
    },
    TEXT: {
      LIGHT: '#FFFCEB',
      DARK: '#000000',
    },
  },
  INPUT: {
    HEIGHT: 45,
    BORDER_RADIUS: 10,
  },
};

const MESSAGES = {
  ERROR: {
    INVALID_CREDENTIALS: 'Credenciais inválidas. Por favor, tente novamente.',
    GENERIC: 'Algo deu errado. Por favor, tente novamente mais tarde.',
    LOGIN_PROCESS: 'Erro ao processar login. Por favor, tente novamente.',
  },
};

// Custom Hooks
const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const updateFormField = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    formData,
    updateFormField,
  };
};

const useAuthService = (onLoginSuccess: () => void) => {
  const authService = AuthService.getInstance();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLoginSuccess = async (userData: UserDTO) => {
    const userPassword = userData.password || '';
    const userName = userData.name || 'Usuário';
    const userEmail = userData.email || '';

    try {
      await authService.register({
        email: userEmail,
        password: userPassword,
        name: userName,
      });
      console.log('Usuário inserido com sucesso');
      onLoginSuccess();
    } catch (error) {
      if (error instanceof Error && error.message === 'Usuário já existe') {
        const user = await authService.login(userEmail, userPassword);
        if (user) {
          console.log('Login realizado com sucesso');
          onLoginSuccess();
        } else {
          Alert.alert('Erro', MESSAGES.ERROR.INVALID_CREDENTIALS);
        }
      } else {
        console.error('Erro ao processar login:', error);
        Alert.alert('Erro', MESSAGES.ERROR.LOGIN_PROCESS);
      }
    }
  };

  return {
    handleLoginSuccess,
    navigation,
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
      placeholderTextColor={THEME.COLORS.TEXT.LIGHT}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const RegisterLink: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNavigateToRegister = () => {
    navigation.navigate('user-register', { onLogin });
  };

  return (
    <TouchableOpacity onPress={handleNavigateToRegister}>
      <Text style={styles.text}>
        Não tem cadastro ainda?
        <Text style={styles.underline}> Cadastre-se</Text>
      </Text>
    </TouchableOpacity>
  );
};

const LoginForm: React.FC<{
  formData: LoginFormData;
  updateFormField: (field: keyof LoginFormData, value: string) => void;
  onSubmit: () => void;
}> = ({ formData, updateFormField, onSubmit }) => (
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
    <LoginButton onPress={onSubmit} />
  </View>
);

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { formData, updateFormField } = useLoginForm();
  const { handleLoginSuccess } = useAuthService(onLogin);

  const handleSubmit = async () => {
    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      if (response?.email) {
        await handleLoginSuccess(response);
      } else {
        Alert.alert('Erro', MESSAGES.ERROR.INVALID_CREDENTIALS);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', MESSAGES.ERROR.GENERIC);
    }
  };

  return (
    <View style={styles.container} lightColor={THEME.COLORS.BACKGROUND.LIGHT} darkColor={THEME.COLORS.BACKGROUND.DARK}>
      <Logo />
      <LoginForm
        formData={formData}
        updateFormField={updateFormField}
        onSubmit={handleSubmit}
      />
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
    height: THEME.INPUT.HEIGHT,
    borderRadius: THEME.INPUT.BORDER_RADIUS,
    backgroundColor: THEME.COLORS.SECONDARY,
    color: THEME.COLORS.TEXT.LIGHT,
    paddingLeft: 10,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: THEME.COLORS.TEXT.DARK,
  },
  underline: {
    textDecorationLine: 'underline',
    color: THEME.COLORS.SECONDARY,
  },
});

export default LoginPage;
