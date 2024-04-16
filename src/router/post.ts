import DashboardLayout from '@/layouts/DashboardLayout.vue'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { usePost, useProfile } from '@/composables'
import { storeToRefs } from 'pinia'
import { usePostStore, useProfileStore, useModalStore } from '@/stores'
import Post from '@/components/Pages/Post/Post.vue'
import PostModal from '@/components/Pages/Post/PostModal.vue'

export default {
  path: '/p/:postId',
  name: 'Post',
  components: {
    default: Post
  },
  fromProfile: 'false',
  meta: { layout: DashboardLayout, requiresAuth: true },
  beforeEnter: async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const { getPost } = usePost()
    const { viewedProfile } = storeToRefs(useProfileStore())
    const { post } = storeToRefs(usePostStore())
    const { showModal, showPostModal } = storeToRefs(useModalStore())


    if (from.matched.length) {
      showModal.value = true
    }

    const postTemp = await getPost(to.params.postId as string)
    showPostModal.value = true

    if (!postTemp) {
      next({
        name: 'NotFound',
        params: { pathMatch: to.path.substring(1).split('/') },
        query: to.query,
        hash: to.hash
      })
    } else {
      post.value = postTemp
      viewedProfile.value = await useProfile().getViewedProfile(postTemp.profile)

      const previousRouteZero = from.matched[0];
      const previousRoute = from

      if (previousRouteZero?.name === 'Profile' || previousRouteZero?.name === 'Tag') {
        const { name } = previousRouteZero;
        const { params } = previousRoute;
        to.matched = from.matched;

        if (name === 'Profile') {
          to.params.username = params.username;
        } else if (name === 'Tag') {
          to.params.tagname = params.tagname;
        }
      }

      to.matched[0].components!.modal = PostModal;

      next();
    }
  }
}