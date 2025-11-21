export type User = {
  PK?: string;
  SK?: string;
  Type?: string;
  userId: string;
  cognitoId?: string;
  name: string;
  email: string;
  role: 'GUEST' | 'USER' | 'ADMIN';
  approved: boolean;
  message?: string;
  password?: string;
  registrationToken?: string;
  avatar?: {
    key: string;
    url: string;
    size?: number;
    contentType?: string;
  };
  createdAt?: string;
};

export type UpdateUserInput = {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
  avatarKey?: string;
}

export type UserCreateDto = {
  name: string;
  email: string;
  message: string;
};

export type UserLoginDto = {
  email: string;
  password: string;
};

export interface ProfileFormValue {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}
