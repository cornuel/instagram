import { defineStore } from 'pinia'
declare const $cookies: any;

interface IState {
  accessToken: Nullable<string>
}


export const useAuthStore = defineStore('auth', {
  state: (): IState => ({
    accessToken: localStorage.getItem('access') || null,
  }),
  actions: {
    getAccessToken() {
      return this.accessToken
    },
    removeAccessToken() {
      this.accessToken = null;
      localStorage.removeItem('access');
    },
    getRefreshToken() {
      return $cookies.get('refresh') || null;
    },
    setAccessToken(newToken: string) {
      this.accessToken = newToken;
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
    removeRefreshToken() {
      $cookies.remove('refresh');
    }
  }
})
