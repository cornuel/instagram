import type { ILogIn, ISignUp } from '@/types/auth'
import axios, { AxiosError } from 'axios'
import { useProfileStore } from '@/stores'


export const useAuth = () => {
  const profileStore = useProfileStore()
  const logIn = async (username: string, password: string) => {
    try {
      const response = await axios.post('token/', {
        username,
        password
      })

      const loginResult: ILogIn = response.data
  
      profileStore.setToken(loginResult.access)
      profileStore.setAuthenticatedUsername(username)
  
  
    } catch (error) {
      return (error as AxiosError).response
    }
  }
  
  const signUp = async (username: string, email: string, password: string) => {
    try {
  
      const response = await axios.post('users/', {
        username,
        email,
        password
      })

      const signUpResult: ISignUp = response.data
  
      return signUpResult

    } catch (error: any) {
      return (error as AxiosError).response
    }
  }
  
  return {
    signUp,
    logIn
  }
}