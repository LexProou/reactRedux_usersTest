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
}

