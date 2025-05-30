import { StyleSheet } from 'react-native';
import LoginButton from '../components/loginButton';
import Logo from '../components/Logo';
import { useNavigation, useRouter } from 'expo-router';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { Text, TextInput, TouchableOpacity, View } from '@/components/Themed';
import { THEME } from '@/constants/theme';
import { LoginProps } from '@/types/common';
import { useAuth } from '@/hooks/useAuth';

type RootStackParamList = {
  'user-register': LoginProps;
  '(tabs)': undefined;
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
      placeholderTextColor={THEME.COLORS.TEXT.LIGHT}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const RegisterLink: React.FC<LoginProps> = ({ onLogin }) => {
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
  formData: { email: string; password: string };
  updateFormField: (field: 'email' | 'password', value: string) => void;
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

const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
  const { formData, updateFormField, handleSubmit } = useAuth(onLogin);

  return (
    <View
      style={styles.container}
      lightColor={THEME.COLORS.BACKGROUND.LIGHT}
      darkColor={THEME.COLORS.BACKGROUND.DARK}>
      <Logo />
      <LoginForm formData={formData} updateFormField={updateFormField} onSubmit={handleSubmit} />
      <RegisterLink onLogin={onLogin} />
    </View>
  );
};

export default function LoginScreen() {
  const router = useRouter();
  
  const handleLogin = () => {
    try {
      router.replace('(tabs)');
    } catch (error) {
      console.error('Erro ao navegar:', error);
    }
  };

  return <LoginPage onLogin={handleLogin} />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    paddingHorizontal: '5%',
    width: '90%',
  },
  input: {
    backgroundColor: THEME.COLORS.SECONDARY,
    borderRadius: THEME.INPUT.BORDER_RADIUS,
    color: THEME.COLORS.TEXT.LIGHT,
    height: THEME.INPUT.HEIGHT,
    paddingLeft: THEME.SPACING.PADDING.HORIZONTAL,
  },
  inputContainer: {
    marginBottom: THEME.SPACING.MARGIN.VERTICAL,
  },
  text: {
    color: THEME.COLORS.TEXT.DARK,
    fontSize: THEME.FONT.SIZE.NORMAL,
    marginTop: THEME.SPACING.MARGIN.TOP,
  },
  underline: {
    color: THEME.COLORS.SECONDARY,
    textDecorationLine: 'underline',
  },
});
