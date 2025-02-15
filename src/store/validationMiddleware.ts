import { Middleware } from 'redux';
import { RootState } from './store';
import { setErrors } from './validationSlice';
import { User } from '../types/User';


interface ValidationRule {
  validate: (value?: string) => boolean; 
  message: string;
}


type ValidationRules = {
  [key: string]: ValidationRule[];
};


type NestedObject = {
  [key: string]: string | undefined | NestedObject;
};

// Правила валидации
const validationRules: ValidationRules = {
  name: [
    {
      validate: (value?: string) => Boolean(value?.trim()),
      message: 'Имя обязательно'
    },
    {
      validate: (value?: string) => Boolean(value && value.length >= 2), 
      message: 'Имя должно содержать минимум 2 символа'
    }
  ],
  username: [
    {
      validate: (value?: string) => Boolean(value?.trim()),
      message: 'Никнейм обязателен'
    },
    {
      validate: (value?: string) => Boolean(value && value.length >= 3),
      message: 'Никнейм должен содержать минимум 3 символа'
    }
  ],
  email: [
    {
      validate: (value?: string) => Boolean(value?.trim()),
      message: 'Email обязателен'
    },
    {
      validate: (value?: string) => Boolean(value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)), 
      message: 'Неверный формат email'
    }
  ],
  phone: [
    {
      validate: (value?: string) => Boolean(value?.trim()),
      message: 'Телефон обязателен'
    },
    {
      validate: (value?: string) => Boolean(value && /^[\d+]*$/.test(value)), 
      message: 'Телефон должен содержать только цифры и, возможно, символ "+" в начале'
    }
  ],
  'address.city': [
    {
      validate: (value?: string) => Boolean(value?.trim()),
      message: 'Город обязателен'
    }
  ],
  'company.name': [
    {
      validate: (value?: string) => Boolean(value?.trim()),
      message: 'Название компании обязательно'
    }
  ]
};

// Функция для получения вложенного значения из объекта
const getNestedValue = (obj: NestedObject, path: string): string | undefined => {
  const parts = path.split('.'); 
  let result: string | undefined | NestedObject = obj;

  for (const part of parts) {
    if (result === undefined || typeof result === 'string') {
      return undefined; 
    }
    result = result[part];
  }

  return result as string | undefined;
};

// Проверка, является ли действие сохранением пользователя
const isSaveUserAction = (action: unknown): action is { type: string; payload: User } => {
  return (
    typeof action === 'object' &&
    action !== null &&
    'type' in action &&
    'payload' in action &&
    typeof (action as { type: string }).type === 'string' &&
    (action as { type: string }).type === 'users/saveUser/pending'
  );
};

// Middleware для валидации данных пользователя
export const validationMiddleware: Middleware<object, RootState> = 
  (store) => 
  (next) => 
  (action: unknown) => {
    const result = next(action);

    if (isSaveUserAction(action)) {
      const userData = action.payload; 
      const errors: Record<string, string> = {}; 

      // Проверка каждого поля
      Object.entries(validationRules).forEach(([field, rules]) => {
        const value = field.includes('.')
          ? getNestedValue(userData as unknown as NestedObject, field) 
          : userData[field as keyof User] as string;

        for (const rule of rules) {
          if (!rule.validate(value)) {
            errors[field] = rule.message; 
            break;
          }
        }
      });

      if (Object.keys(errors).length > 0) {
        store.dispatch(setErrors(errors)); 
      }
    }

    return result; 
  };