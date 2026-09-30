import { UpdatedUser, User } from '../types/user.types';

export type TestUser = {
  user: User;
  password: string;
};

export function createTestUser(): TestUser {
  const timestamp = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const user = {
    username: `user_${timestamp}`,
    email: `user_${timestamp}@mail.com`,
    token: '',
    bio: 'test bio',
    image: 'https://mockmind-api.uifaces.co/content/human/219.jpg'
  } as User;

  return {
    user: user,
    password: `pass12345`
  } as TestUser;
}

export function updateUserData(): UpdatedUser {
  return {
    user: {
      email: 'updated_email@test.com',
      username: 'updated_username',
      bio: 'updated_bio',
      image: 'https://mockmind-api.uifaces.co/content/human/220.jpg',
      password: 'updated_password'
    }
  };
}
