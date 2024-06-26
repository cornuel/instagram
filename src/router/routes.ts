import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

import { storeToRefs } from 'pinia'
import { useProfileStore, useFeedStore } from '@/stores'
import { useFeed } from '@/composables'
import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import post from './post'
import profile from './profile'
import tag from './tag'
import type { IPaginatedPosts } from '@/types'

export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home.vue'),
    meta: { title: 'Instagram', requiresAuth: true },
    beforeEnter: async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const { authenticatedProfile } = storeToRefs(useProfileStore())

      if (authenticatedProfile.value) {
        to.meta.layout = DashboardLayout
        const { setFeed } = useFeedStore()
        const { fetchFeed } = useFeed()

        const res: IPaginatedPosts | null = await fetchFeed()

        if (res) {
          setFeed(res)
        }

      } else {
        to.meta.layout = AuthLayout
      }

      next()
    },
  },
  {
    path: '/accounts/edit',
    name: 'EditProfile',
    component: () => import('@/views/editProfile.vue'),
    meta: { title: 'Edit profile • Instagram', requiresAuth: true },
    beforeEnter: async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const { authenticatedProfile } = storeToRefs(useProfileStore())

      if (authenticatedProfile.value) {
        to.meta.layout = DashboardLayout
      } else {
        to.meta.layout = AuthLayout
      }

      next()
    }
  },
  post,
  profile,
  tag,
  {
    path: '/accounts/login',
    name: 'Login',
    component: () => import('@/components/Pages/Auth/Login.vue'),
    meta: { title: 'Login • Instagram', layout: AuthLayout }
  },
  {
    path: '/accounts/signup',
    name: 'SignUp',
    component: () => import('@/components/Pages/Auth/SignUp.vue'),
    meta: { title: 'Sign up • Instagram', layout: AuthLayout }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/notFound.vue'),
    meta: { title: 'Not found - Instagram', requiresAuth: true },
    beforeEnter: async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const { authenticatedProfile } = storeToRefs(useProfileStore())

      if (authenticatedProfile.value) {
        to.meta.layout = DashboardLayout
      } else {
        to.meta.layout = AuthLayout
      }

      next()
    }
  },
  {
    path: '/too-many-requests',
    name: 'TooManyRequests',
    component: () => import('@/views/tooManyRequests.vue'),
    meta: { title: 'Too many requests • Instagram', requiresAuth: true },
    beforeEnter: async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const { authenticatedProfile } = storeToRefs(useProfileStore())

      if (authenticatedProfile.value) {
        to.meta.layout = DashboardLayout
      } else {
        to.meta.layout = AuthLayout
      }

      next()
    }
  },
] as readonly RouteRecordRaw[]
