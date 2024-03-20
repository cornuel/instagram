import { defineStore } from 'pinia'
import instance from '@/libs/axios/instance'
declare const $cookies: any;

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
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      $cookies.set('refresh', newToken,
        expirationDate, // set expiration time to one week
        '/',
        undefined,
        true, // only send over HTTPS
        'Strict' // prevent CSRF
      )
    },
  }
})
