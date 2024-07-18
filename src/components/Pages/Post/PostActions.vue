<script lang="ts" setup>
import LikeIcon from '@icons/heart.svg'
import LikeActiveIcon from '@icons/heart-active.svg'
import CommentIcon from '@icons/comment.svg'
import SendIcon from '@icons/send.svg'
import BookmarkIcon from '@icons/bookmark.svg'
import BookmarkActiveIcon from '@icons/bookmark-active.svg'

import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostStore, useCommentStore, useResizeStore } from '@/stores'
import { useLike, usePost } from '@/composables'

import { dateDistanceToNow, convertToFullDate } from '@/helpers'

import type { IPaginatedProfiles, IPost } from '@/types'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

const { post } = storeToRefs(usePostStore())
const { commentRef } = storeToRefs(useCommentStore())
const { isDesktop } = storeToRefs(useResizeStore())
const isLike = ref(false)
const isFavorited = ref(false)
const isLoadingLike = ref(false)
const isLoadingFavorited = ref(false)

const disabledLikeButtonComp = computed(() => {
  return isLoadingLike.value ? 'pointer-events-none' : 'pointer-events-auto'
})
const postCreatedAt = computed(() => {
  if (post.value?.created) {
    return dateDistanceToNow(post.value.created)
  }
  return ''
})

const fullCreatedAtComp = computed(() => {
  if (post.value?.created) {
    return convertToFullDate(post.value.created)
  }
  return ''
})

const handleLikePost = async () => {
  const { likePost } = useLike()
  const { setPost } = usePostStore()
  isLoadingLike.value = true
  isLike.value = !isLike.value
  const likeFromModal = true
  try {
    await likePost(post.value!.slug, !isLike.value, likeFromModal)
  } catch (error) {
    isLike.value = !isLike.value
  }
  isLoadingLike.value = false
}

const handleFavoritePost = async () => {
  const { makePostFavorite } = usePost()
  isLoadingFavorited.value = true
  isFavorited.value = !isFavorited.value
  try {
    await makePostFavorite(post.value!.slug, !isFavorited.value)
  } catch (error) {
    isFavorited.value = !isFavorited.value
  }
  isLoadingFavorited.value = false
}

const commentIconClick = () => {
  commentRef.value?.focus()
}

const likeText = computed(() => {
  return post?.value?.like_count === 1 || post?.value?.like_count === 0
    ? 'like'
    : 'likes'
})

const handleClickLikedPost = async () => {
  if (post.value?.like_count === 0) return
  const { setLikedListModal, setIsLoadingLikedList, setLikedList } =
    usePostStore()
  const { getLikedUsers } = useLike()

  setLikedListModal(true)
  setIsLoadingLikedList(true)
  const likedUsers = (await getLikedUsers(
    1,
    post.value!.slug,
    'post'
  )) as IPaginatedProfiles
  setLikedList(likedUsers.results)
  setIsLoadingLikedList(false)
}

onMounted(async () => {
  if (post.value) {
    isLike.value = post.value.is_liked ?? false
    isFavorited.value = post.value.is_favorited ?? false
  }
})
</script>

<template>
  <div
    class="flex flex-col"
    :class="{ 'border-b border-borderColor': isDesktop }"
  >
    <div class="flex justify-between px-[10px] py-[6px]">
      <div class="flex">
        <div class="p-2 cursor-pointer select-none">
          <LikeIcon
            v-if="!isLike"
            class="w-6 fill-textColor-primary text-textColor-primary animate-[0.45s_like-button-animation_ease-in-out]"
            :class="disabledLikeButtonComp"
            @click="handleLikePost"
          />
          <LikeActiveIcon
            v-else
            class="w-6 text-error fill-error animate-[0.45s_like-button-animation_ease-in-out]"
            :class="disabledLikeButtonComp"
            @click="handleLikePost"
          />
        </div>
        <div class="p-2 cursor-pointer select-none">
          <CommentIcon
            class="fill-textColor-primary text-textColor-primary"
            @click="commentIconClick"
          />
        </div>
        <div class="p-2 cursor-pointer select-none">
          <SendIcon class="fill-textColor-primary text-textColor-primary" />
        </div>
      </div>
      <div class="p-2 cursor-pointer select-none">
        <BookmarkIcon
          v-if="!isFavorited"
          class="w-6 h-6 fill-textColor-primary text-textColor-primary"
          @click="handleFavoritePost"
        />
        <BookmarkActiveIcon
          v-else
          class="w-6 h-6 fill-textColor-primary text-textColor-primary"
          @click="handleFavoritePost"
        />
      </div>
    </div>
    <div class="flex justify-between">
      <div class="flex flex-col px-4 mb-4">
        <span
          class="text-sm font-semibold"
          :class="{
            'cursor-pointer': post!.like_count > 0
          }"
          @click="handleClickLikedPost"
          >{{ post!.like_count.toLocaleString('en-US').replace(',', '.') }}
          {{ likeText }}</span
        >
        <span
          class="text-[10px] uppercase text-textColor-secondary"
          :title="fullCreatedAtComp"
          >{{ postCreatedAt }}</span
        >
      </div>
      <div class="flex px-4 mb-4">
        <span class="text-sm font-normal text-textColor-secondary"
          >{{
            post!.view_count.toLocaleString('en-US').replace(',', '.')
          }}
          views</span
        >
      </div>
    </div>
  </div>
</template>
