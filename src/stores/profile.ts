import { defineStore } from 'pinia'
import type { IProfile } from '@/types'

interface IState {
  authenticatedUsername: Nullable<string>
  postProfile: Nullable<IProfile>
  viewedProfile: Nullable<IProfile>
  authenticatedProfile: Nullable<IProfile>
}

export const useProfileStore = defineStore('profile', {
  state: (): IState => ({
    authenticatedUsername: localStorage.getItem('authenticatedUsername') || null,
    postProfile: null,
    viewedProfile: null,
    authenticatedProfile: JSON.parse(localStorage.getItem('authenticatedProfile') || 'null')
  }),
  actions: {
    increasePostsCount() {
      this.authenticatedProfile!.posts_count++
    },
    decreasePostsCount() {
      this.authenticatedProfile!.posts_count--
    },
    increaseFollowingCount(currentProfile: IProfile) {
      // If viewing own profile, increase following on viewedProfile
      if (currentProfile?.username) {
        if (currentProfile?.username === this.authenticatedProfile?.username) {
          this.authenticatedProfile!.following_count++
          this.viewedProfile!.following_count++
        }
        // If viewing profile thats about to be followed, increase following on authenticatedProfile and followers on said account
        else if (currentProfile?.username === this.viewedProfile?.username) {
          this.authenticatedProfile!.following_count++
          this.viewedProfile!.followers_count++
        }
        else {
          this.authenticatedProfile!.following_count++
        }
      } else {
        this.authenticatedProfile!.following_count++
      }
    },
    decreaseFollowingCount(currentProfile: IProfile) {
      if (currentProfile?.username) {
        if (currentProfile?.username === this.authenticatedProfile?.username) {
          this.authenticatedProfile!.following_count--
          this.viewedProfile!.following_count--
        }
        else if (currentProfile?.username === this.viewedProfile?.username) {
          this.authenticatedProfile!.following_count--
          this.viewedProfile!.followers_count--
        }
        else {
          this.authenticatedProfile!.following_count--
        }
      } else {
        this.authenticatedProfile!.following_count--
      }
    },
    increaseFollowersCount() {
      if (this.viewedProfile?.username !== this.authenticatedProfile?.username) {
        this.viewedProfile!.followers_count++
      }
    },
    decreaseFollowersCount() {
      if (this.viewedProfile?.username !== this.authenticatedProfile?.username) {
        this.viewedProfile!.followers_count--
      }
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
    setPostProfile(user: Nullable<IProfile>) {
      this.postProfile = user
    },
    getAuthenticatedProfile() {
      return this.authenticatedProfile
    },
    setAuthenticatedProfile(authenticatedProfile: Nullable<IProfile>) {
      this.authenticatedProfile = authenticatedProfile
      localStorage.setItem('authenticatedProfile', JSON.stringify(authenticatedProfile))
    },
    removeAuthenticatedProfile() {
      this.authenticatedProfile = null
      this.authenticatedUsername = null
      localStorage.removeItem('authenticatedProfile')
      localStorage.removeItem('authenticatedUsername')
    }
  }
})
