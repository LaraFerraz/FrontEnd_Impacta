/**
 * Constantes e Enums centralizados
 * Evita magic strings e garante consistência
 */

// Enums de Gênero
export const GENDER = {
  MALE: 'M',
  FEMALE: 'F',
  OTHER: 'O'
};

export const GENDER_LABELS = {
  [GENDER.MALE]: 'Masculino',
  [GENDER.FEMALE]: 'Feminino',
  [GENDER.OTHER]: 'Outro'
};

// Estados de carregamento
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Tipos de Toast/Notificação
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Mensagens padrão
export const MESSAGES = {
  LOGIN: {
    SUCCESS: 'Bem-vindo de volta!',
    ERROR: 'Email ou senha inválidos',
    REQUIRED: 'Email e senha são obrigatórios'
  },
  CADASTRO: {
    SUCCESS: 'Conta criada com sucesso!',
    ERROR: 'Erro ao criar conta',
    TERMS_REQUIRED: 'Você deve aceitar os termos de uso'
  },
  PERFIL: {
    UPDATE_SUCCESS: 'Perfil atualizado com sucesso!',
    UPDATE_ERROR: 'Erro ao atualizar perfil'
  },
  FORM: {
    REQUIRED_FIELD: 'Este campo é obrigatório',
    INVALID_EMAIL: 'Email inválido',
    PASSWORD_MISMATCH: 'Senhas não coincidem',
    PASSWORD_WEAK: 'Senha muito fraca'
  }
};

// Rotas públicas (não precisam autenticação)
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/cadastro',
  '/sobre',
  '/campanhas',
  '/campanhas/:id'
];

// Rotas protegidas (precisam autenticação)
export const PROTECTED_ROUTES = [
  '/perfil',
  '/editar-perfil',
  '/meus-favoritos'
];

// Validação - Regexes
export const REGEX = {
  EMAIL: /^\S+@\S+\.\S+$/,
  PASSWORD_STRONG: /(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};:'",.<>?/\\|`~])/,
  PASSWORD_MEDIUM: /(?=.*[A-Z])(?=.*\d)/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,}$/
};

// Limites de campos
export const FIELD_LIMITS = {
  NAME_MIN: 3,
  NAME_MAX: 100,
  EMAIL_MAX: 255,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 128,
  PHONE_MIN: 10,
  PHONE_MAX: 20,
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  BIO_MAX: 500,
  DESCRIPTION_MAX: 5000
};

// Tempo de espera/Timeouts (em ms)
export const TIMEOUTS = {
  TOAST_DURATION: 3000,
  REDIRECT_DELAY: 1500,
  API_TIMEOUT: 10000,
  DEBOUNCE_SEARCH: 300
};

// Tipos de erro HTTP
export const HTTP_ERRORS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Interesses/Categorias padrão (exemplo)
export const CATEGORIES = {
  EDUCATION: 'Educação',
  ENVIRONMENT: 'Meio Ambiente',
  HEALTH: 'Saúde',
  SOCIAL: 'Social',
  TECHNOLOGY: 'Tecnologia',
  ARTS: 'Artes',
  SPORTS: 'Esportes'
};
