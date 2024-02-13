import { defineStore } from 'pinia'
import type { IProfile } from '@/types'
import axios from 'axios'

interface IState {
  token: Nullable<string>
  authenticatedUsername: Nullable<string>
  viewedProfile: Nullable<IProfile>
  authenticatedProfile: Nullable<IProfile>
}

export const useProfileStore = defineStore('profile', {
  state: (): IState => ({
    token: localStorage.getItem('token') || null,
    authenticatedUsername: localStorage.getItem('authenticatedUsername') || null,
    viewedProfile: null,
    authenticatedProfile: JSON.parse(localStorage.getItem('authenticatedProfile') || 'null')
  }),
  actions: {
    setAxiosAuthHeader(token: string) {
      if (token) {
        console.log(token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
    },
    getToken() {
      return this.token
    },
    setToken(newToken: string) {
      this.token = newToken;
      this.setAxiosAuthHeader(newToken);
      localStorage.setItem('token', newToken);
    },
    getAuthenticatedUsername() {
      return this.authenticatedUsername
    },
    setAuthenticatedUsername(username: string) {
      this.authenticatedUsername = username
      localStorage.setItem('authenticatedUsername', username)
    },
    removeAuthenticatedUsername() {
      this.authenticatedUsername = null
    },
    getViewedProfile() {
      return this.viewedProfile
    },
    setViewedProfile(user: Nullable<IProfile>) {
      this.viewedProfile = user
    },
    getAuthenticatedProfile() {
      return this.authenticatedProfile
    },
    setAuthenticatedProfile(authenticatedProfile: Nullable<IProfile>) {
      this.authenticatedProfile = authenticatedProfile
      localStorage.setItem('authenticatedProfile', JSON.stringify(authenticatedProfile))
    }
  }
})
