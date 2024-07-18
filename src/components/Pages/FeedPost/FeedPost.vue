<script setup lang="ts">
import type { IPost } from '@/types'
import { onBeforeMount, provide, ref } from 'vue'
import FeedPostHeader from './FeedPostHeader.vue'
import FeedPostSwiper from './FeedPostSwiper.vue'
import FeedPostActions from './FeedPostActions.vue'
import FeedPostTags from './FeedPostTags.vue'
import FeedPostTitle from './FeedPostTitle.vue'
import FeedPostLikes from './FeedPostLikes.vue'
import FeedPostComment from './FeedPostComment.vue'
import { useProfileStore, usePostStore } from '@/stores'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  post: IPost
}>()

provide('post', props.post)

const isLoading = ref(true)
const { likedListModal } = storeToRefs(usePostStore())

const close = () => {
  likedListModal.value = false
}

onBeforeMount(async () => {
  isLoading.value = false
})
</script>

<template>
  <div v-if="!isLoading">
    <FeedPostHeader />
    <FeedPostSwiper />
    <FeedPostActions />
    <FeedPostLikes />
    <FeedPostTitle />
    <FeedPostTags />
    <FeedPostComment />
    <div class="border-b border-borderColor"></div>
  </div>
  <div v-else></div>
</template>
