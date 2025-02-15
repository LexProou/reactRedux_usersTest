export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  address: {
    city: string;
  };
  phone: string;
  company: {
    name: string;
  };
  isArchived: boolean;
  [key: string]: string | object | undefined | number | boolean ; // Индексная сигнатура для поддержки динамических полей
}
