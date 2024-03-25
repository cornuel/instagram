import type { ILogInResult, ISignUpResult, ISignUpError, ILogInError } from '@/types/auth'
import { AxiosError } from 'axios'
import { useProfileStore, useAuthStore } from '@/stores'
import instance from '@/libs/axios/instance'



export const useAuth = () => {
  const profileStore = useProfileStore()
  const authStore = useAuthStore()

  const logIn = async (username: string, password: string): Promise<ILogInResult> => {
    try {
      const response = await instance.post<ILogInResult>('token/', {
        username,
        password
      })

      const loginResult: ILogInResult = response.data

      authStore.setAccessToken(loginResult.access)
      authStore.setRefreshToken(loginResult.refresh)
      profileStore.setAuthenticatedUsername(username)

      return loginResult

    } catch (error) {
      const typedError = error as ILogInError;
      if (typedError.response) {
        const { status, data } = typedError.response;
        if (status === 401 && data.detail) {
          // Invalid Details
          throw new Error(data.detail);
        } else {
          throw new Error('An unexpected error occurred');
        }
      } else {
        throw new Error('Network error or error without response');
      }
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

  const signUp = async (username: string, email: string, password: string): Promise<ISignUpResult> => {
    try {
      const response = await instance.post<ISignUpResult>('users/', {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      const typedError = error as ISignUpError;
      if (typedError.response) {
        const { status, data } = typedError.response;
        if (status === 400 && data.username) {
          // Username already taken
          throw new Error(data.username[0]);
        } else if (status === 400 && data.password) {
          // Invalid Password
          throw new Error(data.password[0]);
        } else if (status === 400 && data.email) {
          // Invalid Email
          throw new Error(data.email[0]);
        } else {
          throw new Error('An unexpected error occurred');
        }
      } else {
        throw new Error('Network error or error without response');
      }
    }
  };

  return {
    signUp,
    logIn,
    refreshToken,
    isTokenValid
  }
}