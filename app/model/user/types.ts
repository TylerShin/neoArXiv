export interface IUser {
  id: string;
  email: string[];
  username: string;
  password: string;
}

export interface ITokenPayload {
  id: string;
  username: string;
  password: string;
}
