import { defineStore } from 'pinia'
import instance from '@/libs/axios/instance'

interface IState {
  accessToken: Nullable<string>
}

export const useAuthStore = defineStore('auth', {
  state: (): IState => ({
    accessToken: localStorage.getItem('access') || null,
  }),
  actions: {
    setAxiosAuthHeader(token: string) {
      if (token) {
        console.log(token)
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete instance.defaults.headers.common['Authorization'];
      }
    },
    getAccessToken() {
      return this.accessToken
    },
    getRefreshToken() {
      return $cookies.get('refresh') || null;
    },
    setAccessToken(newToken: string) {
      this.accessToken = newToken;
      this.setAxiosAuthHeader(newToken);
      localStorage.setItem('access', newToken);
    },
    setRefreshToken(newToken: string) {
      $cookies.set('refresh', newToken,
        '1w', // set expiration time to one week
        '/',
        undefined,
        true, // only send over HTTPS
        'Strict' // prevent CSRF
      )
    },
  }
})