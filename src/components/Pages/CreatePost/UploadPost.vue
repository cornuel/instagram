<script lang="ts" setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount
} from 'vue'
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
const { authenticatedProfile, viewedProfile } = storeToRefs(
  useProfileStore()
)
const profileStore = useProfileStore()

const isUploadding = ref(true)

const gifStyle = computed(() => {
  return {
    backgroundImage: `url(${getDynamicImage(isUploadding.value ? 'uploading.gif' : 'done-uploading.gif')})`
  }
})

watch(
  isUploadding,
  () => {
    title.value = isUploadding.value
      ? 'Sharing...'
      : 'Post shared'
  },
  { immediate: true }
)

onMounted(async () => {
  const { resetCreatePost } = useCreatePostStore()
  const { setPost } = usePost()
  const response = await setPost()
  if (response) {
    isUploadding.value = false
    nextTick(() => {
      setTimeout(() => {
        modalCreatePostShow.value = false
        authenticatedProfile.value.posts_count += 1
        if (
          authenticatedProfile.value.username ==
          viewedProfile.value.username
        ) {
          userPosts.value.results.unshift(response)
          profileStore.setAuthenticatedProfile(
            authenticatedProfile.value
          )
        }
        resetCreatePost()
      }, 1000)
    })
  } else {
    console.log('error')
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
      class="w-[96px] h-[96px] bg-cover bg-center bg-no-repeat"
      :style="gifStyle"
    ></div>

    <p
      v-if="!isUploadding"
      class="my-4 text-xl text-textColor-primary"
    >
      Your post has been shared.
    </p>
  </div>
</template>
