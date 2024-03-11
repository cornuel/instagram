import type { ILogIn, ISignUp } from '@/types/auth'
import { AxiosError } from 'axios'
import { useProfileStore, useAuthStore } from '@/stores'
import instance from '@/libs/axios/instance'


export const useAuth = () => {
  const profileStore = useProfileStore()
  const authStore = useAuthStore()

  const logIn = async (username: string, password: string) => {
    try {
      const response = await instance.post('token/', {
        username,
        password
      })

      const loginResult: ILogIn = response.data

      authStore.setAccessToken(loginResult.access)
      authStore.setRefreshToken(loginResult.refresh)
      profileStore.setAuthenticatedUsername(username)


    } catch (error) {
      return (error as AxiosError).response
    }
  }

  const refreshToken = async (refreshToken: string) => {
    try {
      const response = await instance.post('token/refresh/', {
        refresh: refreshToken
      })

      authStore.setAccessToken(response.data.access)
      return response.status === 200
    } catch (error) {
      return (error as AxiosError).response
    }
  }

  const isTokenValid = async (accessToken: string) => {
    try {
      const response = await instance.post('token/verify/', {
        access: accessToken
      })

      return response.status === 200

    } catch (error) {
      return (error as AxiosError).response
    }
  }

  const signUp = async (username: string, email: string, password: string) => {
    try {

      const response = await instance.post('users/', {
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
    logIn,
    refreshToken,
    isTokenValid
  }
}