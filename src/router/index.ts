import routes from './routes'
import { createRouter, createWebHistory } from 'vue-router'

import { useLoadingStore, useProfileStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: 'link-active',
  linkExactActiveClass: 'exact-link-active',
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (to.name == from.name || to.matched[0] != from.matched[0]) {
        return {
          top: 0
        }
      }
    }
  }
})

const authPath = ['/accounts/login', '/accounts/signup']

router.beforeEach(async (to, from) => {
  const { startLoading, startSplash } = useLoadingStore()
  if (from.name) {
    startLoading()
  } else {
    startSplash()
  }

  if (to.meta.requiresAuth) {
    console.log('requires auth')
    // return '/accounts/login'
  } else {
    // if (authPath.includes(to.path)) {
    //   return '/'
    // } else {
    //   return
    // }
  }
})

// handle splash screen
router.afterEach((to, from) => {
  if (to.meta.title) document.title = (to.meta.title as string) || 'Instagram'
  const { stopLoading, stopSplash } = useLoadingStore()
  stopLoading()
  stopSplash()
})

export default router
