import type { IPaginatedPosts } from '@/types'
import { defineStore } from 'pinia'

interface IState {
  feed: Nullable<IPaginatedPosts>
}

export const useFeedStore = defineStore('feed', {
  state: (): IState => ({
    feed: null,
  }),
  actions: {
    getFeed(): Nullable<IPaginatedPosts> {
      return this.feed
    },
    setFeed(posts: Nullable<IPaginatedPosts>) {
      this.feed = posts
    },
  }
})
