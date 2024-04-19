<script lang="ts" setup>
import Loading from '@/components/Utils/Loading.vue'
import UiButton from '@/components/Atom/UiButton.vue'
import ImageIcon from '@icons/image.svg'
import PostReviewItem from '@/components/Pages/Post/PostReviewItem.vue'
import { ref, onBeforeMount } from 'vue'

import { onBeforeRouteUpdate } from 'vue-router'

import { storeToRefs } from 'pinia'
import { useLayoutStore, usePostStore, useProfileStore } from '@/stores'
import { usePost } from '@/composables'
import VueEternalLoading from '@/helpers/VueEternalLoading.vue'
import type { LoadAction } from '@/types/vue-eternal'
import { load } from '@/helpers/eternalLoader'

const { viewedProfile, authenticatedProfile } = storeToRefs(useProfileStore())
const { userPosts, showedPosts } = storeToRefs(usePostStore())
const isLoading = ref(true)
const page = ref(1)

const { getLayoutClass } = storeToRefs(useLayoutStore())

const getPosts = async () => {
  const { getUserPosts } = usePost()
  // reset page
  page.value = 1
  isLoading.value = true
  if (viewedProfile.value) {
    userPosts.value = await getUserPosts(
      page.value,
      viewedProfile.value.username
    )
    showedPosts.value = userPosts.value
  }
  isLoading.value = false
}

const loadMorePosts = (loadAction: LoadAction): Promise<void> => {
  const { getUserPosts } = usePost()
  return load(
    (page: number, query?: string) => getUserPosts(page, query as string),
    loadAction,
    (page.value += 1),
    viewedProfile.value?.username!
  )
}

onBeforeMount(async () => {
  // console.log(route.path)
  // const regex = /\/(following|followers|p\/[^/]*)/
  // const match = regex.exec(route.path)
  // if (!match) {
  await getPosts()
  // }
}),
  onBeforeRouteUpdate(async ({ params: toParams }, { params: fromParams }) => {
    if (
      toParams.username === fromParams.username &&
      (fromParams.username !== viewedProfile.value?.username ||
        !/following|followers/.test(fromParams.username))
    ) {
      return
    }
    await getPosts()
  })
</script>

<template>
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
          class="flex flex-center"
        >
          <div
            class="w-full max-w-[350px] mx-11 my-[60px] flex flex-col items-center justify-center"
          >
            <template
              v-if="
                authenticatedProfile &&
                authenticatedProfile?.id == viewedProfile!.id
              "
            >
              <div class="flex items-center justify-center">
                <ImageIcon
                  class="w-8 h-8 text-black absolute"
                  style="stroke-width: 1px"
                />
                <div
                  class="w-16 h-16 rounded-full border-black"
                  style="border-width: 1.5px"
                ></div>
              </div>
              <span class="my-6 text-3xl font-extrabold">Share Photos</span>
              <span class="mb-6"
                >When you share photos, they will appear on your profile.</span
              >
              <UiButton variant="text">Share your first photo</UiButton>
            </template>
          </div>
        </div>
      </template>
    </Transition>
  </div>
</template>
