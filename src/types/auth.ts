export interface ILogInResult {
  refresh: string,
  access: string
}

export type ILogInError = {
  response: {
    data: {
      detail?: string;
    };
    status: number;
  };
}

export type ISignUpError = {
  response: {
    data: {
      username?: string;
      password?: string;
      email?: string;
    };
    status: number;
  };
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