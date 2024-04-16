<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useProfileStore,
  usePostStore,
  useCreatePostStore,
  useModalStore
} from '@/stores'
import { usePost } from '@/composables'
import { getDynamicImage } from '@/helpers'
import { nextTick } from 'vue'

const { title } = storeToRefs(useCreatePostStore())
const { modalCreatePostShow } = storeToRefs(useModalStore())
const { userPosts } = storeToRefs(usePostStore())
const { authenticatedProfile, viewedProfile } = storeToRefs(useProfileStore())
const profileStore = useProfileStore()

const isUploading = ref(true)
const errorMessage = ref('')

const gifStyle = computed(() => {
  return {
    backgroundImage: `url(${getDynamicImage(isUploading.value ? 'uploading.gif' : 'done-uploading.gif')})`
  }
})

watch(
  isUploading,
  () => {
    title.value = isUploading.value ? 'Sharing...' : 'Post shared'
  },
  { immediate: true }
)

onMounted(async () => {
  const { resetCreatePost } = useCreatePostStore()
  const { setPost } = usePost()
  try {
    const response = await setPost()
    isUploading.value = false
    nextTick(() => {
      setTimeout(() => {
        modalCreatePostShow.value = false
        if (authenticatedProfile.value) {
          authenticatedProfile.value.posts_count += 1
        }
        if (
          authenticatedProfile.value?.username ==
            viewedProfile.value?.username &&
          userPosts.value?.results
        ) {
          userPosts.value.results.unshift(response)
          userPosts.value.count += 1
          profileStore.setAuthenticatedProfile(authenticatedProfile.value)
        }
        resetCreatePost()
      }, 1000)
    })
  } catch (err) {
    if (err instanceof Error) {
      errorMessage.value = err.message
    } else {
      errorMessage.value = 'An unexpected error occurred'
    }
    nextTick(() => {
      setTimeout(() => {
        modalCreatePostShow.value = false
        resetCreatePost()
      }, 2000)
    })
  }
})

onBeforeUnmount(() => {
  const { resetCreatePost } = useCreatePostStore()
  resetCreatePost()
})
</script>

<template>
  <div class="flex flex-col flex-center h-full w-[400px]">
    <div
      v-if="errorMessage === ''"
      class="w-[96px] h-[96px] bg-cover bg-center bg-no-repeat"
      :style="gifStyle"
    ></div>

    <p
      v-if="!isUploading"
      class="my-4 text-xl text-textColor-primary"
    >
      Your post has been shared.
    </p>
    <p
      v-if="errorMessage !== ''"
      class="my-4 text-xl text-textColor-primary"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>
