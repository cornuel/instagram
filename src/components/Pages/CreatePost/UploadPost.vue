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
import type { IPost } from '@/types'

const { title } = storeToRefs(useCreatePostStore())
const { modalCreatePostShow } = storeToRefs(useModalStore())

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
        const { increasePostsCount } = useProfileStore()
        const { addPosttoUserPosts } = usePostStore()

        increasePostsCount()
        addPosttoUserPosts(response as IPost)
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
  <div class="flex flex-col flex-center w-[400px] h-[400px] items-center">
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
