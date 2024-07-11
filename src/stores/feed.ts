import type { IPaginatedPosts } from '@/types'
import { useFeed, useProfile } from '@/composables'
import { usePostStore, useProfileStore } from '@/stores'
import { defineStore, storeToRefs } from 'pinia'

interface IState {
  feed: Nullable<IPaginatedPosts>
}

export const useFeedStore = defineStore('feed', {
  state: (): IState => ({
    feed: {
      count: 0,
      next: '',
      previous: '',
      results: []
    },
  }),
  actions: {
    getFeed(): Nullable<IPaginatedPosts> {
      return this.feed
    },
    async setFeed(page: number = 1) {
      const { fetchFeed } = useFeed()
      const { getProfile } = useProfile()
      const { showedPosts } = storeToRefs(usePostStore())
      const { feedProfiles } = storeToRefs(useProfileStore())
      const res = await fetchFeed(page)

      if (res) {
        this.feed!.count = res.count
        this.feed!.next = res.next
        this.feed!.previous = res.previous
        this.feed!.results = this.feed!.results?.concat(res.results!) || res.results!;
        // console.log(res)
        // showedPosts.value = this.feed
      }

      if (this.feed) {
        for (const post of this.feed.results!) {
          const profileId = post.profile;
          if (!feedProfiles.value[profileId]) {
            const profile = await getProfile(profileId);
            if (profile) {
              feedProfiles.value[profileId] = profile;
              console.log(`Profile ${profileId} added to feed profiles`)
            } else {
              console.warn(`Profile not found for ID: ${profileId}`);
            }
          }
        }
      }

      return res
    },
  }
})
