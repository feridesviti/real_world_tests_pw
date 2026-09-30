export interface User {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
}

export interface LoginResponse {
  user: User;
}

export interface UpdatedUser {
  user: {
    email?: string | null;
    username?: string;
    bio?: string | null;
    image?: string | null;
    password?: string | null;
  };
}

export interface UserSettings {
  urlPicture?: string;
  name?: string;
  bio?: string;
  email?: string;
  newPassword?: string;
}
