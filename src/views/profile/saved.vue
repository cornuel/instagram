<script lang="ts" setup>
import Loading from '@/components/Utils/Loading.vue'
import PostReviewItem from '@/components/Pages/Post/PostReviewItem.vue'
import { usePost } from '@/composables'
import { useLayoutStore, usePostStore, useProfileStore } from '@/stores'
import BookmarkIcon from '@icons/bookmark.svg'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import VueEternalLoading from '@/helpers/VueEternalLoading.vue'
import type { LoadAction } from '@/types/vue-eternal'
import { loadPosts } from '@/helpers/eternalLoader'

const { showedPosts, favoritedPosts } = storeToRefs(usePostStore())
const { authenticatedProfile } = storeToRefs(useProfileStore())
const isLoading = ref(true)

const { getLayoutClass } = storeToRefs(useLayoutStore())

const getPosts = async () => {
  const { getFavoritedPosts } = usePost()
  isLoading.value = true
  favoritedPosts.value = await getFavoritedPosts(page.value)
  showedPosts.value = favoritedPosts.value
  isLoading.value = false
}

const page = ref(1)

const loadMorePosts = (loadAction: LoadAction): Promise<void> => {
  const { getFavoritedPosts } = usePost()
  return loadPosts(
    (page: number) => getFavoritedPosts(page),
    loadAction,
    page.value + 1
  )
}

onBeforeMount(async () => {
  await getPosts()
}),
  onBeforeRouteUpdate(async ({ params: toParams }, { params: fromParams }) => {
    if (
      toParams.username === fromParams.username &&
      (fromParams.username !== authenticatedProfile.value?.username ||
        !/following|followers/.test(fromParams.username))
    ) {
      return
    }
    await getPosts()
  })
</script>

<template>
  <div class="flex items-center justify-between w-full mt-4 mb-4">
    <span class="text-xs text-textColor mx-2"
      >Only you can see what you've saved</span
    >
  </div>
  <div>
    <Transition
      :duration="{ enter: 300, leave: 200 }"
      name="postsTransition"
    >
      <Loading
        v-if="isLoading"
        class="absolute left-1/2 mt-10"
      />
      <template v-else>
        <div
          v-if="showedPosts && showedPosts.count > 0"
          class="flex flex-wrap"
        >
          <TransitionGroup name="list">
            <PostReviewItem
              :class="getLayoutClass"
              class="innerPostsTransition px-[2px] mb-1"
              v-for="post in showedPosts.results"
              :key="post.id"
              :post="post"
            />
          </TransitionGroup>
          <VueEternalLoading :load="loadMorePosts"></VueEternalLoading>
        </div>
        <div
          v-else
          class="w-full max-w-[350px] mx-auto my-[60px] flex flex-col items-center justify-center"
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

          <span class="my-6 text-3xl font-extrabold">Save</span>
          <span class="text-center"
            >Save photos and videos that you want to see again. No one is
            notified, and only you can see what you've saved.</span
          >
        </div>
      </template>
    </Transition>
  </div>
</template>
