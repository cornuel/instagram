import DashboardLayout from '@/layouts/DashboardLayout.vue'

import type {
  NavigationGuardNext,
  RouteLocationNormalized
} from 'vue-router'

import { useTag, useSearch } from '@/composables'
import { useSearchStore, useTagStore, usePostStore } from '@/stores'
import { storeToRefs } from 'pinia'

const guardTag = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const { getTag } = useTag()
  const { fetchPostsByTagQuery } = useSearch()

  getTag(to.params.tagname as string).then(async (tag) => {

    if (!tag) {
      next({
        name: 'NotFound',
        params: {
          pathMatch: to.path.substring(1).split('/')
        },
        query: to.query,
        hash: to.hash
      })
    } else {
      const { setQuery, setSearchedPosts } =
        useSearchStore()
      const { setCurrentTag } = useTagStore()

      setQuery(tag.name)
      setCurrentTag(tag)

      document.title = `#${tag.name} on Instagram | Hashtags`
    }

    next()
  })
}

export default {
  path: '/explore/tags/:tagname',
  name: 'Tag',
  components: { default: () => import('@/views/tag/index.vue') },
  meta: { layout: DashboardLayout, requiresAuth: true },
  redirect: { name: 'TagPosts' },
  beforeEnter: guardTag,
  children: [
    {
      path: '',
      name: 'TagPosts',
      components: {
        default: () => import('@/views/tag/posts.vue')
      },
    }
  ]
}