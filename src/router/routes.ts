import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

import { useProfileStore } from '@/stores'
import type { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router'
import post from './post'
import profile from './profile'

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
      const profileStore = useProfileStore()
      const authenticatedProfile = profileStore.getAuthenticatedProfile()

      console.log(authenticatedProfile)

      if (authenticatedProfile) to.meta.layout = DashboardLayout
      else to.meta.layout = AuthLayout

      next()
    }
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
      const profileStore = useProfileStore()
      const authenticatedProfile = profileStore.getAuthenticatedProfile()

      console.log(authenticatedProfile)

      if (authenticatedProfile) to.meta.layout = DashboardLayout
      else to.meta.layout = AuthLayout

      next()
    }
  },
  post,
  profile,
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
    component: () => import('@/components/Pages/Auth/SignUp.vue'),
    meta: { title: 'Not found - Instagram', layout: AuthLayout }
  }
] as readonly RouteRecordRaw[]
