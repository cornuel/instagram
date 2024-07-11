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

import type { IPaginatedProfiles } from '@/types'

import type { IPost } from '@/types'
import { inject } from 'vue'

const post = inject<IPost>('post')
const { commentRef } = storeToRefs(useCommentStore())
const { isDesktop } = storeToRefs(useResizeStore())
const isLike = computed(() => {
  return post!.is_liked
})
const isFavorited = computed(() => {
  return post!.is_favorited
})
const isLoadingLike = ref(false)
const isLoadingFavorited = ref(false)

const disabledLikeButtonComp = computed(() => {
  return isLoadingLike.value ? 'pointer-events-none' : 'pointer-events-auto'
})

const handleLikePost = async () => {
  const { likePost } = useLike()
  const { setPost } = usePostStore()
  setPost(post!)
  isLoadingLike.value = true
  post!.is_liked = !post!.is_liked
  try {
    await likePost(post!.slug, !isLike.value)
  } catch (error) {
    console.log('error', error)
    post!.is_liked = !post!.is_liked
  }
  isLoadingLike.value = false
}

const handleFavoritePost = async () => {
  const { makePostFavorite } = usePost()
  isLoadingFavorited.value = true
  post!.is_favorited = !post?.is_favorited
  try {
    await makePostFavorite(post!.slug, !isFavorited.value)
  } catch (error) {
    post!.is_favorited = !post?.is_favorited
  }
  isLoadingFavorited.value = false
}

const commentIconClick = () => {
  commentRef.value?.focus()
}

// const handleClickLikedPost = async () => {
//   if (post?.like_count === 0) return
//   const { setLikedListModal, setIsLoadingLikedList, setLikedList } =
//     usePostStore()
//   const { getLikedUsers } = useLike()

//   setLikedListModal(true)
//   setIsLoadingLikedList(true)
//   const likedUsers = (await getLikedUsers(
//     post!.slug,
//     'post'
//   )) as IPaginatedProfiles
//   setLikedList(likedUsers.results)
//   setIsLoadingLikedList(false)
// }

onMounted(async () => {
  if (post) {
    const { setLikedList } = usePostStore()
    const { getLikedUsers } = useLike()

    isLike.value = post.is_liked ?? false
    isFavorited.value = post.is_favorited ?? false
    // const likedUsers = (await getLikedUsers(
    //   post!.slug,
    //   'post'
    // )) as IPaginatedProfiles
    // setLikedList(likedUsers.results)
  }
})
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-between pt-[6px]">
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
          <RouterLink
            :to="{
              name: 'Post',
              params: { postId: post!.slug }
            }"
          >
            <CommentIcon
              class="fill-textColor-primary text-textColor-primary animate-[0.45s_like-button-animation_ease-in-out]"
              @click="commentIconClick"
            />
          </RouterLink>
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
  </div>
</template>
