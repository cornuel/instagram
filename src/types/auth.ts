export interface ILogInResult {
  refresh: string,
  access: string
}

export type IApiErrorData = {
  detail?: string;
  username?: string[];
  password?: string[];
  email?: string[];
}

export type ISignUpResult = {
  id: number;
  username: string;
  email: string;
  url: string;
}

export type IAuth = {
  logIn: ILogInResult
  signUp: ISignUpResult
}