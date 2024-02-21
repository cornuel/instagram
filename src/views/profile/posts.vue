<script lang="ts" setup>
import Loading from '@/components/Utils/Loading.vue'
import UiButton from '@/components/Atom/UiButton.vue'
import ImageIcon from '@icons/image.svg'
import PostReviewItem from '@/components/Pages/Post/PostReviewItem.vue'

import { ref, onBeforeMount, onMounted } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostStore, useProfileStore } from '@/stores'
import { usePost } from '@/composables'
import VueEternalLoading from '@/helpers/VueEternalLoading.vue'
import type { LoadAction } from '@/types/vue-eternal'

const { viewedProfile, authenticatedProfile } = storeToRefs(
  useProfileStore()
)
const { userPosts } = storeToRefs(usePostStore())
const isLoading = ref(true)

const getPosts = async () => {
  const existingPosts = usePostStore().getPosts()
  // if(!existingPosts) {
  //   if (existingPosts?.results[0].profile !== user.value.username) {
  const { getUserPosts } = usePost()
  isLoading.value = true
  userPosts.value = await getUserPosts(
    viewedProfile.value.username,
    page.value
  )
  isLoading.value = false
  //   }
  // }
  // else {
  isLoading.value = false
  // }
}

const page = ref(1)

async function load({ loaded }: LoadAction): Promise<void> {
  const { getUserPosts } = usePost()
  if (userPosts.value.next) {
    page.value += 1
    const loadedPosts = await getUserPosts(
      viewedProfile.value.username,
      page.value
    )
    userPosts.value.next = loadedPosts.next
    userPosts.value.results.push(...loadedPosts.results)
    usePostStore().setPosts(userPosts.value)
    loaded(userPosts.value.results.length, 9)
  } else {
    loaded(0, 0)
  }
}

onBeforeMount(async () => {
  // const existingPosts = usePostStore().getPosts()
  // if(!existingPosts) {
  //   await getPosts();
  // }
  await getPosts()
}),
  onBeforeRouteUpdate(async () => {
    await getPosts()
  })
</script>

<template>
  <div>
    <Loading v-if="isLoading" class="mt-10" />
    <template v-else>
      <div
        v-if="userPosts"
        class="flex flex-wrap -mx-[2px]"
      >
        <PostReviewItem
          class="w-1/3 px-[2px] mb-1"
          v-for="post in userPosts.results"
          :key="post.id"
          :post="post"
        />
        <VueEternalLoading :load="load"></VueEternalLoading>
      </div>
      <div v-else class="flex flex-center">
        <div
          class="w-full max-w-[350px] mx-11 my-[60px] flex flex-col
            flex-center text-center"
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
            <span class="my-6 text-3xl font-extrabold"
              >Share Photos</span
            >
            <span class="mb-6"
              >When you share photos, they will appear on
              your profile.</span
            >
            <UiButton variant="text"
              >Share your first photo</UiButton
            >
          </template>
        </div>
      </div>
    </template>
  </div>
</template>