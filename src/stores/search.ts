import { defineStore } from 'pinia'
import type { IPaginatedPosts, IPaginatedProfiles } from '@/types'

interface IState {
  query: string
  searchedPosts: Nullable<IPaginatedPosts>
  searchedProfiles: Nullable<IPaginatedProfiles>
}

export const useSearchStore = defineStore('search', {
  state: (): IState => ({
    query: '',
    searchedPosts: null,
    searchedProfiles: null
  }),
  actions: {
    getQuery(): string {
      return this.query
    },
    setQuery(query: string) {
      this.query = query
    },
    getSearchedPosts(): Nullable<IPaginatedPosts> {
      return this.searchedPosts
    },
    getSearchedProfiles(): Nullable<IPaginatedProfiles> {
      return this.searchedProfiles
    },
    setSearchedPosts(posts: Nullable<IPaginatedPosts>) {
      this.searchedPosts = posts
    },
    setSearchedProfiles(profiles: Nullable<IPaginatedProfiles>) {
      this.searchedProfiles = profiles
    }
  }
})
