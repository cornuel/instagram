import DashboardLayout from '@/layouts/DashboardLayout.vue'

import type {
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router'

import { useTag, useSearch } from '@/composables'
import { useSearchStore, useTagStore } from '@/stores'

const guardProfile = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const { getTag } = useTag()
  const { fetchPostsByTagQuery } = useSearch()
  getTag(to.params.tagname as string).then(async (tag) => {
    if (!tag) {
      console.log('Tag not found')
      next({
        name: 'NotFound',
        params: {
          pathMatch: to.path.substring(1).split('/')
        },
        query: to.query,
        hash: to.hash
      })
    } else {
      console.log('Tag found')
      const { setQuery, setSearchedPosts } =
        useSearchStore()
      const { setCurrentTag } = useTagStore()

      setQuery(tag.name)
      setCurrentTag(tag)

      const res = await fetchPostsByTagQuery(tag.name, 1)

      if (res) {
        setSearchedPosts({
          count: res.count,
          next: res.next,
          previous: res.previous,
          results: res.results.posts
        })

        document.title = `#${tag.name} on Instagram | Hashtags`
      }

      next()
    }
  })
}

export default {
  path: '/explore/tags/:tagname',
  name: 'Tag',
  component: () => import('@/views/tag.vue'),
  meta: { layout: DashboardLayout, requiresAuth: true },
  beforeEnter: guardProfile,
}
