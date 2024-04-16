<script lang="ts" setup>
import BackIcon from '@icons/back.svg'
import Post from '@/components/Pages/Post/Post.vue'

import { ref, onMounted } from 'vue'
import {
  useRouter,
  onBeforeRouteUpdate,
  type RouteLocationNormalized,
  type NavigationGuardNext
} from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostStore } from '@/stores'
import { usePost } from '@/composables'

const router = useRouter()
const { post } = storeToRefs(usePostStore())
const isLoading = ref(true)

const getPostFn = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  // const { getUserWithCheckFollow } = useProfile()
  const { getPost } = usePost()

  const postTemp = await getPost(to.params.postId as string)

  if (!postTemp) {
    next({
      name: 'NotFound',
      params: {
        pathMatch: to.path.substring(1).split('/')
      },
      query: to.query,
      hash: to.hash
    })
  } else {
    post.value = postTemp

    // if (viewedProfile.value?.id != postTemp?.userId) {
    //   viewedProfile.value = await getUserWithCheckFollow(postTemp.userId)
    // }

    next()
  }
}

const getOtherPosts = async () => {
  // const { getOtherUserPosts } = usePost()
  isLoading.value = true
  // otherPosts.value = await getOtherUserPosts(viewedProfile.value!.id, post.value!.id)
  isLoading.value = false
}

onBeforeRouteUpdate(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    await getPostFn(to, from, next)
    await getOtherPosts()
  }
)

onMounted(async () => {
  await getOtherPosts()
})
</script>

<template>
  <div class="w-[calc(100%-40px)] max-w-[935px] py-4 px-5 mx-auto box-content">
    <div
      class="fixed top-0 left-0 right-0 h-[45px] px-4 flex min-[768px]:hidden items-center bg-bgColor-primary border-b border-borderColor z-30"
    >
      <div class="flex-shrink-0">
        <BackIcon
          class="w-6 h-6 cursor-pointer"
          @click="router.back()"
        />
      </div>
      <div class="flex-grow flex flex-center text-center cursor-pointer">
        <span class="text-base font-semibold">Posts</span>
      </div>
    </div>
    <Post />
  </div>
</template>
