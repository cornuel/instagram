<script lang="ts" setup>
import LikeIcon from '@icons/heart-active.svg'
import CommentIcon from '@icons/comment-active.svg'
import MultipleIcon from '@icons/multiple-active.svg'
import ReelIcon from '@icons/reel-active.svg'
import PlayIcon from '@icons/play.svg'

import { computed, ref } from 'vue'
import type { IPost } from '@/types'
import { formatNumberToSuffix } from '@/helpers'

const props = defineProps<{
  post: IPost
}>()

const likeCountComp = computed(() => {
  return formatNumberToSuffix(props.post.like_count)
})

const commentCountComp = computed(() => {
  return formatNumberToSuffix(props.post.comment_count)
})
</script>

<template>
  <RouterLink
    :to="{ name: 'Post', params: { postId: post.slug } }"
  >
    <div
      class="relative group/review w-full pt-[100%] cursor-pointer
        overflow-hidden rounded-sm"
    >
      <div class="absolute top-0 left-0 w-full h-full">
        <!-- <img
          class="w-full h-full object-cover"
          :src="post.images[0].thumbnail"
          :alt="post.title"
        /> -->
        <img
          :src="post.images[0].thumbnail"
          alt="post.title"
          class="absolute w-full h-full object-contain"
        />
        <!-- Original Image -->
        <!-- <img
          v-if="!loading"
          :src="post.images[0].image"
          alt="post.title"
          class="absolute w-full h-full object-cover"
        /> -->
      </div>
      <div
        class="absolute top-0 left-0 w-full h-full flex flex-center
          bg-[rgba(0,0,0,0.5)] opacity-0
          group-hover/review:opacity-100 transition-opacity z-10"
      >
        <div class="text-center">
          <div class="text-white text-xl">
            {{ post.title }}
          </div>
          <div class="flex">
            <div class="flex items-center mr-7">
              <LikeIcon
                class="w-5 h-5 text-white fill-white"
              />
              <span
                class="ml-2 text-base font-bold text-white"
                >{{ likeCountComp }}</span
              >
            </div>
            <div class="flex items-center">
              <CommentIcon
                class="w-[18px] h-[18px] text-white fill-white"
              />
              <span
                class="ml-2 text-base font-bold text-white"
                >{{ commentCountComp }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="post.type != 'image'"
        class="absolute top-2 right-2"
      >
        <MultipleIcon v-if="post.images.length > 1" />
        <ReelIcon v-if="post.type == 'reel'" />
        <PlayIcon v-if="post.type == 'video'" />
      </div>
    </div>
  </RouterLink>
</template>
