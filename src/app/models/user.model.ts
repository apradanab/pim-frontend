export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'GUEST' | 'USER' | 'ADMIN';
  approved: boolean;
  message?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserCreateDto = {
  name: string;
  email: string;
  message: string;
};

export type UserLoginDto = {
  email: string;
  password: string;
};

export type UserRegistrationDto = {
  token: string;
  password: string;
};
