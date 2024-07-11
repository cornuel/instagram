<script lang="ts" setup>
import Loading from '@/components/Utils/Loading.vue'
import CommentItem from './CommentItem.vue'

import { ref, watch } from 'vue'
import type { IComment, IPaginatedComments } from '@/types'
import { useComment } from '@/composables'
import { usePostStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { post } = storeToRefs(usePostStore())
const page = ref(1)

const props = defineProps<{
  comment: IComment
}>()

const replies = ref<Nullable<IPaginatedComments>>(null)
const loadingReply = ref(false)
const showReplies = ref(false)
const renderReplies = ref(false)

const toggleReplies = async () => {
  showReplies.value = !showReplies.value
  if (showReplies.value) {
    await getRepliesFn()
    renderReplies.value = true
  } else {
    renderReplies.value = false
  }
}

const getRepliesFn = async () => {
  const { getReplies } = useComment()

  loadingReply.value = true
  if (post.value) {
    replies.value = await getReplies(
      post.value.slug,
      props.comment.id,
      page.value
    )
  }
  loadingReply.value = false
}

watch(
  () => props.comment.replies_count,
  async () => {
    if (showReplies.value) {
      await getRepliesFn()
      renderReplies.value = true
    }
  }
)
</script>

<template>
  <div class="">
    <CommentItem v-bind="comment" />
    <div
      v-if="comment.replies_count > 0"
      class="ml-[54px]"
    >
      <div
        class="flex items-center cursor-pointer"
        @click="toggleReplies"
      >
        <div
          class="inline-block w-6 h-[1px] bg-textColor-secondary align-middle mr-4"
        ></div>
        <span class="text-xs text-textColor-secondary font-semibold">
          {{
            renderReplies
              ? 'Hide replies'
              : 'View replies (' + comment.replies_count + ')'
          }}
        </span>
        <Loading
          v-if="loadingReply"
          class="ml-2"
          width="16px"
        />
      </div>
      <div
        v-if="renderReplies && replies"
        class="mt-3"
      >
        <CommentItem
          v-for="reply in replies.results"
          :key="reply.id"
          v-bind="reply"
        />
      </div>
    </div>
  </div>
</template>
