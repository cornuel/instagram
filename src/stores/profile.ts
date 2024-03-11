import { defineStore } from 'pinia'
import type { IProfile } from '@/types'

interface IState {
  authenticatedUsername: Nullable<string>
  viewedProfile: Nullable<IProfile>
  authenticatedProfile: Nullable<IProfile>
}

export const useProfileStore = defineStore('profile', {
  state: (): IState => ({
    authenticatedUsername: localStorage.getItem('authenticatedUsername') || null,
    viewedProfile: null,
    authenticatedProfile: JSON.parse(localStorage.getItem('authenticatedProfile') || 'null')
  }),
  actions: {
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
