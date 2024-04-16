import type { ILogInResult, ISignUpResult } from '@/types/auth'
import { useProfileStore, useAuthStore } from '@/stores'
import { instance, setAxiosAuthHeader, axiosAPI } from '@/libs'



export const useAuth = () => {
  const profileStore = useProfileStore()
  const authStore = useAuthStore()

  const { handleApiError } = axiosAPI()

  const logIn = async (
    username: string,
    password: string)
    : Promise<ILogInResult | null> => {
    try {
      const response = await instance.post<ILogInResult>('token/', {
        username,
        password
      })

      const loginResult: ILogInResult = response.data

      setAxiosAuthHeader(loginResult.access)
      authStore.setAccessToken(loginResult.access)
      authStore.setRefreshToken(loginResult.refresh)
      profileStore.setAuthenticatedUsername(username)

      return loginResult

    } catch (error) {
      handleApiError(error)
      return null;
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
      handleApiError(error)
      return null;
    }
  }

  const isTokenValid = async (accessToken: string) => {
    try {
      const response = await instance.post('token/verify/', {
        access: accessToken
      })

      return response.status === 200

    } catch (error) {
      handleApiError(error)
      return null;
    }
  }

  const signUp = async (
    username: string,
    email: string,
    password: string
  ): Promise<ISignUpResult | null> => {
    try {
      const response = await instance.post<ISignUpResult>(
        'users/',
        {
          username,
          email,
          password
        }
      )
      return response.data
    } catch (error) {
      handleApiError(error)
      return null;
    }
  }

  return {
    signUp,
    logIn,
    refreshToken,
    isTokenValid
  }
}