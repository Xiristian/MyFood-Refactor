export const DEFAULT_MEALS = [
  { name: 'Desjejum', iconName: 'sunrise', position: 0 },
  { name: 'Café da manhã', iconName: 'coffee', position: 1 },
  { name: 'Almoço', iconName: 'sun', position: 2 },
  { name: 'Café da tarde', iconName: 'coffee', position: 3 },
  { name: 'Jantar', iconName: 'moon', position: 4 },
] as const;

export const ICON_MAP = {
  sunrise: 'sunrise',
  coffee: 'coffee',
  sun: 'sun',
  moon: 'moon',
} as const;

export const ERROR_MESSAGES = {
  LOGIN: {
    INVALID_CREDENTIALS: 'Credenciais inválidas. Por favor, tente novamente.',
    GENERIC: 'Algo deu errado. Por favor, tente novamente mais tarde.',
    LOGIN_PROCESS: 'Erro ao processar login. Por favor, tente novamente.',
  },
  MEALS: {
    LOAD_ERROR: 'Erro ao carregar refeições:',
    CREATE_ERROR: 'Erro ao criar refeição:',
    ADD_FOOD_ERROR: 'Erro ao adicionar alimentos:',
    DELETE_ERROR: 'Erro ao excluir refeição:',
    UPDATE_ERROR: 'Erro ao atualizar refeição:',
  },
  FOOD: {
    SEARCH_ERROR: 'Erro ao buscar alimentos:',
    CREATE_ERROR: 'Erro ao criar alimento:',
    DELETE_ERROR: 'Erro ao excluir alimento:',
    UPDATE_ERROR: 'Erro ao atualizar alimento:',
  },
  USER: {
    REGISTER_SUCCESS: 'Usuário cadastrado com sucesso!',
    REGISTER_ERROR: 'Erro ao registrar usuário.',
    UPDATE_ERROR: 'Erro ao atualizar usuário.',
    VALIDATION: {
      REQUIRED_FIELDS: 'Por favor, preencha todos os campos.',
      PASSWORD_MISMATCH: 'As senhas não coincidem. Por favor, tente novamente.',
    },
  },
} as const;

export const APP_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_RESULTS: 50,
  },
  IMAGE: {
    QUALITY: 1,
    ASPECT_RATIO: [1, 1],
  },
  DATE_FORMAT: {
    DISPLAY: 'DD/MM/yyyy',
  },
} as const;
