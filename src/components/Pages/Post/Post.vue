<script lang="ts" setup>
import Loading from '@/components/Utils/Loading.vue'
import EmojiIcon from '@icons/emoji.svg'
import EmojiPicker from '@/components/Molecules/Emoji/EmojiPicker.vue'
import PostSwiper from './PostSwiper.vue'
import PostHeader from './PostHeader.vue'
import PostComments from './PostComments.vue'
import PostActions from './PostActions.vue'
import UsersWhoLikedModel from '@/components/Modal/UsersWhoLikedModal.vue'

import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useProfileStore,
  usePostStore,
  useCommentStore
} from '@/stores'
import { useComment } from '@/composables'
import type { IComment } from '@/types'

const { authenticatedProfile } = storeToRefs(
  useProfileStore()
)
const { post, likedListModal } = storeToRefs(usePostStore())
const { comment, commentRef, replyTo } = storeToRefs(
  useCommentStore()
)
const emojiPickerActive = ref(false)
const loadingComment = ref(false)

const postContainerWidth = computed(() => {
  if (post.value!.ratio >= 1) {
    return { maxWidth: '935px' }
  } else {
    const widthTemp = 600 * post.value!.ratio + 335
    return { maxWidth: Math.max(widthTemp, 480) + 'px' }
  }
})

const handleClickEmoji = (emoji: string) => {
  if (commentRef.value) {
    commentRef.value.setRangeText(
      emoji,
      commentRef.value.selectionStart!,
      commentRef.value.selectionEnd!,
      'end'
    )
    comment.value = commentRef.value.value
    commentRef.value.focus()
  }
}

const handleInputComment = () => {
  commentRef.value!.style.height = ''
  commentRef.value!.style.height =
    Math.min(commentRef.value!.scrollHeight, 80) + 'px'
}

const handleComment = async () => {
  if (comment.value != '' && authenticatedProfile.value) {
    const { addCommentPost } = useComment()

    loadingComment.value = true
    await addCommentPost(
      post.value!.id,
      null,
      comment.value
    )

    emojiPickerActive.value = false
    loadingComment.value = false
    commentRef.value!.value = ''
    comment.value = ''
  }
}
</script>

<template>
  <div
    class="py-4 px-5 mx-auto box-content"
    :style="postContainerWidth"
  >
    <div
      class="flex flex-col min-[736px]:flex-row w-full mx-auto
        min-h-[480px] max-h-none min-[736px]:max-h-[600px]
        box-content border border-borderColor rounded-xl"
    >
      <div
        class="flex-grow flex items-center overflow-hidden rounded-tl-xl
          min-[736px]:rounded-bl-xl"
      >
        <PostSwiper class="w-full" />
      </div>
      <div
        class="flex flex-col w-full min-[736px]:w-[335px] flex-shrink-0
          border-l-0 min-[736px]:border-l border-borderColor"
      >
        <PostHeader />
        <PostComments
          class="flex-grow border-b border-borderColor h-[200px]
            min-[736px]:h-auto"
        />
        <PostActions />
        <div
          v-if="authenticatedProfile"
          class="flex items-center pr-2 py-[6px]"
          v-click-outside="
            () => {
              emojiPickerActive = false
            }
          "
        >
          <div class="relative px-4 py-2">
            <EmojiIcon
              width="24"
              height="24"
              class="cursor-pointer fill-textColor-primary text-textColor-primary"
              @click="
                () => {
                  emojiPickerActive = !emojiPickerActive
                }
              "
            />
            <EmojiPicker
              v-if="emojiPickerActive"
              class="absolute left-0 min-[380px]:left-4 min-[380px]:w-[315px]
                bottom-full mb-[7px]"
              @clicked="handleClickEmoji"
            />
          </div>
          <div class="flex-grow flex relative">
            <textarea
              v-model="comment"
              ref="commentRef"
              placeholder="Add a comment..."
              class="h-[20px] w-full resize-none leading-[18px] overflow-y-hidden"
              @input="handleInputComment"
            />
            <Loading
              v-if="loadingComment"
              class="absolute top-0 left-0 w-full h-full"
            />
          </div>
          <button
            class="flex-shrink-0 p-2 font-semibold text-buttonColor-primary
              hover:text-link disabled:opacity-40
              disabled:hover:text-buttonColor-primary
              disabled:cursor-default cursor-pointer"
            :disabled="comment == ''"
            @click="handleComment"
          >
            Post
          </button>
        </div>
        <div
          v-else
          class="py-2 px-4 text-textColor-secondary"
        >
          <RouterLink
            :to="{ name: 'Login' }"
            class="text-buttonColor-primary hover:text-link"
            >Đăng nhập</RouterLink
          >
          <span> để thích hoặc bình luận.</span>
        </div>
      </div>
    </div>
    <UsersWhoLikedModel v-if="likedListModal" />
  </div>
</template>
