import { useState } from 'react';
import { Alert } from 'react-native';
import { AuthService } from '@/database/services/AuthService';
import { login, UserDTO } from '@/backend/user';
import { ERROR_MESSAGES } from '@/constants/app';
import { FormData, ValidationResult } from '@/types/common';

interface AuthState {
  formData: FormData;
  isLoading: boolean;
  error: string | null;
}

interface AuthStateBuilder {
  withFormData(formData: FormData): AuthStateBuilder;
  withLoading(isLoading: boolean): AuthStateBuilder;
  withError(error: string | null): AuthStateBuilder;
  build(): AuthState;
}

class AuthStateBuilderImpl implements AuthStateBuilder {
  private state: Partial<AuthState> = {};

  withFormData(formData: FormData): AuthStateBuilder {
    this.state.formData = formData;
    return this;
  }

  withLoading(isLoading: boolean): AuthStateBuilder {
    this.state.isLoading = isLoading;
    return this;
  }

  withError(error: string | null): AuthStateBuilder {
    this.state.error = error;
    return this;
  }

  build(): AuthState {
    if (!this.state.formData || this.state.isLoading === undefined) {
      throw new Error('AuthState is missing required properties');
    }
    return {
      formData: this.state.formData,
      isLoading: this.state.isLoading,
      error: this.state.error || null,
    };
  }
}

class AuthValidator {
  static validate(formData: FormData): ValidationResult {
    if (!formData.email || !formData.password) {
      return {
        isValid: false,
        message: ERROR_MESSAGES.USER.VALIDATION.REQUIRED_FIELDS,
      };
    }

    if (!formData.email.includes('@')) {
      return {
        isValid: false,
        message: 'E-mail inválido',
      };
    }

    if (formData.password.length < 6) {
      return {
        isValid: false,
        message: 'A senha deve ter pelo menos 6 caracteres',
      };
    }

    return { isValid: true };
  }
}

export const useAuth = (onLoginSuccess: () => void) => {
  const [authState, setAuthState] = useState<AuthState>({
    formData: { email: '', password: '' },
    isLoading: false,
    error: null,
  });

  const authService = AuthService.getInstance();
  const createAuthStateBuilder = (): AuthStateBuilder => new AuthStateBuilderImpl();

  const updateAuthState = (newState: AuthState): void => {
    setAuthState(newState);
  };

  const updateFormField = (field: keyof FormData, value: string): void => {
    const newState = createAuthStateBuilder()
      .withFormData({ ...authState.formData, [field]: value })
      .withLoading(false)
      .withError(null)
      .build();
    updateAuthState(newState);
  };

  const handleLoginSuccess = async (userData: UserDTO): Promise<void> => {
    const { email = '', password = '', name = 'Usuário' } = userData;
    try {
      await authService.register({ email, password, name });
      console.log('Usuário inserido com sucesso');
      if (onLoginSuccess && typeof onLoginSuccess === 'function') {
        onLoginSuccess();
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Usuário já existe') {
        try {
          const user = await authService.login(email, password);
          if (user) {
            console.log('Login realizado com sucesso');
            if (onLoginSuccess && typeof onLoginSuccess === 'function') {
              onLoginSuccess();
            }
          } else {
            throw new Error(ERROR_MESSAGES.LOGIN.INVALID_CREDENTIALS);
          }
        } catch (loginError) {
          console.error('Erro ao fazer login:', loginError);
          throw new Error(ERROR_MESSAGES.LOGIN.LOGIN_PROCESS);
        }
      } else {
        console.error(ERROR_MESSAGES.LOGIN.LOGIN_PROCESS, error);
        throw new Error(ERROR_MESSAGES.LOGIN.LOGIN_PROCESS);
      }
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const validation = AuthValidator.validate(authState.formData);
    if (!validation.isValid) {
      Alert.alert('Erro', validation.message || ERROR_MESSAGES.LOGIN.INVALID_CREDENTIALS);
      return;
    }

    try {
      const newState = createAuthStateBuilder()
        .withFormData(authState.formData)
        .withLoading(true)
        .withError(null)
        .build();
      updateAuthState(newState);

      const response = await login({
        email: authState.formData.email,
        password: authState.formData.password,
      });
      
      if (response?.email) {
        await handleLoginSuccess(response);
      } else {
        throw new Error(ERROR_MESSAGES.LOGIN.INVALID_CREDENTIALS);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.LOGIN.GENERIC;

      const errorState = createAuthStateBuilder()
        .withFormData(authState.formData)
        .withLoading(false)
        .withError(errorMessage)
        .build();
      updateAuthState(errorState);

      Alert.alert('Erro', errorMessage);
    } finally {
      const finalState = createAuthStateBuilder()
        .withFormData(authState.formData)
        .withLoading(false)
        .withError(authState.error)
        .build();
      updateAuthState(finalState);
    }
  };

  return {
    formData: authState.formData,
    isLoading: authState.isLoading,
    error: authState.error,
    updateFormField,
    handleSubmit,
  };
};
