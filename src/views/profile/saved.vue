<script lang="ts" setup>
import Loading from '@/components/Utils/Loading.vue'
import PostReviewItem from '@/components/Pages/Post/PostReviewItem.vue'
import { usePost } from '@/composables'
import { usePostStore } from '@/stores'
import BookmarkIcon from '@icons/bookmark.svg'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import VueEternalLoading from '@/helpers/VueEternalLoading.vue'
import type { LoadAction } from '@/types/vue-eternal'
import { type IPaginatedPosts } from '@/types'

const { favoritedPosts } = storeToRefs(usePostStore())
const isLoading = ref(true)

const getPosts = async () => {
  const { getFavoritedPosts } = usePost()
  isLoading.value = true
  favoritedPosts.value = await getFavoritedPosts(page.value)
  isLoading.value = false
}

const page = ref(1)

async function load({ loaded }: LoadAction): Promise<void> {
  const { getFavoritedPosts } = usePost()
  let loadedPosts: IPaginatedPosts | null = null

  if (
    favoritedPosts.value?.results &&
    favoritedPosts.value?.next
  ) {
    page.value += 1
    loadedPosts = await getFavoritedPosts(page.value)

    if (loadedPosts) {
      favoritedPosts.value.results.push(
        ...loadedPosts.results!
      )
      favoritedPosts.value.next = loadedPosts.next
      usePostStore().setFavoritedPosts(favoritedPosts.value)
      loaded(favoritedPosts.value.results.length, 9)
    }
  } else {
    loaded(0, 0)
  }
}

onBeforeMount(async () => {
  await getPosts()
}),
  onBeforeRouteUpdate(async () => {
    // console.log(route.path)
    // const regex = /\/([^/]+)\/(following)/
    // const match = regex.exec(route.path)
    // if (!match) {
    await getPosts()
    // }
  })
</script>

<template>
  <div
    class="flex items-center justify-between w-full mt-4 mb-4"
  >
    <span class="text-xs text-textColor"
      >Only you can see what you've saved</span
    >
  </div>
  <div>
    <Loading v-if="isLoading" class="mt-10" />
    <template v-else>
      <div v-if="favoritedPosts" class="flex flex-wrap">
        <PostReviewItem
          class="w-1/3 px-[2px] mb-1"
          v-for="post in favoritedPosts.results"
          :key="post.id"
          :post="post"
        />
        <VueEternalLoading :load="load"></VueEternalLoading>
      </div>
      <div
        v-else
        class="w-full max-w-[350px] mx-11 my-[60px] flex flex-col
          flex-center text-center"
      >
        <div class="flex items-center justify-center">
          <BookmarkIcon
            class="w-8 h-8 text-black absolute"
            style="stroke-width: 1px"
          />
          <div
            class="w-16 h-16 rounded-full border-black"
            style="border-width: 1.5px"
          ></div>
        </div>

        <span class="my-6 text-3xl font-extrabold"
          >Save</span
        >
        <span class="text-center"
          >Save photos and videos that you want to see
          again. No one is notified, and only you can see
          what you've saved.</span
        >
      </div>
    </template>
  </div>
</template>
