import DashboardLayout from '@/layouts/DashboardLayout.vue'

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useProfile } from '@/composables'
import { useProfileStore } from '@/stores'

const guardProfile = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const { getViewedProfile } = useProfile()
  getViewedProfile(to.params.username as string).then(async (user) => {
    if (!user) {
      console.log('User not found')
      next({
        name: 'NotFound',
        params: { pathMatch: to.path.substring(1).split('/') },
        query: to.query,
        hash: to.hash
      })
    } else {

      next()
    }
  })
}

const handleFollowModal = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const isFromProfile = from.matched.some((route) => route.name == 'Profile')
  const currentViewIndex = to.matched.length - 1
  const prevViewIndex = from.matched.length - 1

  if (!isFromProfile) {
    to.matched[currentViewIndex].components = {
      default: () => import('@/views/profile/posts.vue'),
      modal: () => import('@/components/Modal/FollowsModal.vue')
    }
  }

  if (isFromProfile) {
    if (to.matched[currentViewIndex]) {
      to.matched[currentViewIndex]!.components = {
        default: from.matched[prevViewIndex].components!.default,
        modal: () => import('@/components/Modal/FollowsModal.vue')
      }
    }

    if (from.matched.length > 1) {
      const childView = from.matched.slice(1)
      for (const view of childView) {
        to.matched.push(view)
      }
    }
  }


  next()
}

export default {
  path: '/:username',
  name: 'Profile',
  components: {
    default: () => import('@/views/profile/index.vue'),
  },
  meta: { layout: DashboardLayout, requiresAuth: true },
  redirect: { name: 'Posts' },
  beforeEnter: guardProfile,
  children: [
    {
      path: '',
      name: 'Posts',
      components: {
        default: () => import('@/views/profile/posts.vue'),
      },
    },
    {
      path: 'saved',
      name: 'Saved',
      beforeEnter: (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext) => {
        const { viewedProfile, authenticatedProfile } = useProfileStore()
        if (viewedProfile?.id === authenticatedProfile?.id) {
          next()
        } else {
          next({ name: 'Posts', params: { username: viewedProfile?.username } })
        }
      },
      components: {
        default: () => import('@/views/profile/saved.vue'),
      },
    },
    {
      path: 'tagged',
      name: 'Tagged',
      components: {
        default: () => import('@/views/profile/tagged.vue'),
      },
    },
    {
      path: 'followers',
      name: 'Followers',
      beforeEnter: handleFollowModal,
      children: [
        {
          path: 'mutualOnly',
          name: 'MutualFollowers',
          component: () => import('../components/Modal/FollowsModal.vue')
        },
        {
          path: 'mutualFirst',
          name: 'MutualFirstFollowers',
          component: () => import('../components/Modal/FollowsModal.vue')
        }
      ]
    },
    {
      path: 'following',
      name: 'Following',
      beforeEnter: handleFollowModal
    }
  ]
}
