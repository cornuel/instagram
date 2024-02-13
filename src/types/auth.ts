export interface ILogIn {
  refresh: string, 
  access: string
}

export interface ISignUp {
  username: string
  email: string
  password: string
  url: string
}
export type IAuth = {
  logIn: ILogIn
  signUp: ISignUp
}