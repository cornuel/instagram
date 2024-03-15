<script lang="ts" setup>
import LikeIcon from '@icons/heart.svg'
import LikeActiveIcon from '@icons/heart-active.svg'
import CommentIcon from '@icons/comment.svg'
import SendIcon from '@icons/send.svg'
import BookmarkIcon from '@icons/bookmark.svg'
import BookmarkActiveIcon from '@icons/bookmark-active.svg'

import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostStore, useCommentStore } from '@/stores'
import { useLike, usePost } from '@/composables'
import {
  dateDistanceToNow,
  convertToFullDate
} from '@/helpers'
import type { IPaginatedUsers, IPostLike } from '@/types'

const { post } = storeToRefs(usePostStore())
const { commentRef } = storeToRefs(useCommentStore())
const like = ref<Nullable<IPostLike>>(null)
const isLike = ref(false)
const isFavorited = ref(false)
const isLoadingLike = ref(false)
const isLoadingFavorited = ref(false)

const disabledLikeButtonComp = computed(() => {
  return isLoadingLike.value
    ? 'pointer-events-none'
    : 'pointer-events-auto'
})
const postCreatedAt = computed(() =>
  dateDistanceToNow(post.value!.created)
)
const fullCreatedAtComp = computed(() =>
  convertToFullDate(post.value!.created.toUpperCase())
)

const handleLikePost = async () => {
  const { likePost } = useLike()
  isLoadingLike.value = true
  isLike.value = !isLike.value
  try {
    await likePost(post.value!.slug, !isLike.value)
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
    await makePostFavorite(post.value!.slug)
  } catch (error) {
    isFavorited.value = !isFavorited.value
  }
  isLoadingFavorited.value = false
}

const commentIconClick = () => {
  commentRef.value?.focus()
}

const handleClickLikedPost = async () => {
  const {
    setLikedListModal,
    setIsLoadingLikedList,
    setLikedList
  } = usePostStore()
  const { getLikedUsers } = useLike()

  setLikedListModal(true)
  setIsLoadingLikedList(true)
  const likedUsers: IPaginatedUsers = await getLikedUsers(
    post.value!.slug,
    'post'
  )
  setLikedList(likedUsers.results)
  setIsLoadingLikedList(false)
}

onMounted(async () => {
  isLike.value = post.value.is_liked
  isFavorited.value = post.value.is_favorited
})
</script>

<template>
  <div class="flex flex-col border-b border-borderColor">
    <div class="flex justify-between px-[10px] py-[6px]">
      <div class="flex">
        <div class="p-2 cursor-pointer select-none">
          <LikeIcon
            v-if="!isLike"
            class="w-6 fill-textColor-primary text-textColor-primary
              animate-[0.45s_like-button-animation_ease-in-out]"
            :class="disabledLikeButtonComp"
            @click="handleLikePost"
          />
          <LikeActiveIcon
            v-else
            class="w-6 text-error fill-error
              animate-[0.45s_like-button-animation_ease-in-out]"
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
          <SendIcon
            class="fill-textColor-primary text-textColor-primary"
          />
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
    <div class="flex flex-col px-4 mb-4">
      <span
        class="text-sm font-semibold cursor-pointer"
        @click="handleClickLikedPost"
        >{{
          post!.like_count
            .toLocaleString('en-US')
            .replace(',', '.')
        }}
        likes</span
      >
      <span
        class="text-[10px] uppercase text-textColor-secondary"
        :title="fullCreatedAtComp"
        >{{ postCreatedAt }}</span
      >
    </div>
  </div>
</template>
