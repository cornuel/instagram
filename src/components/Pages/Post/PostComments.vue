<script lang="ts" setup>
import Loading from '@/components/Utils/Loading.vue'
import Tag from '@/components/Atom/Tag.vue'
import Comment from '@/components/Molecules/Comment/Comment.vue'
import CommentItem from '@/components/Molecules/Comment/CommentItem.vue'
import VueEternalLoading from '@/helpers/VueEternalLoading.vue'
import type { LoadAction } from '@/types/vue-eternal'

import { ref, computed, onBeforeMount } from 'vue'
import { useComment } from '@/composables'
import { storeToRefs } from 'pinia'
import { usePostStore, useCommentStore } from '@/stores'

const { post } = storeToRefs(usePostStore())
const { comments } = storeToRefs(useCommentStore())
const loading = ref(true)
const page = ref(1)

const captionComp = computed(() => ({
  id: 'caption',
  profile: post.value!.profile,
  body: post.value!.body,
  created: post.value!.created
}))

async function load({ loaded }: LoadAction): Promise<void> {
  const { getCommentsPost } = useComment()
  if (comments.value?.next) {
    page.value += 1
    const loadedComments = await getCommentsPost(
      post.value!.slug,
      page.value
    )
    // update next value
    comments.value.next = loadedComments.next
    // push new comments
    comments.value.results.push(...loadedComments.results)
    useCommentStore().setComments(comments.value)
    loaded(comments.value.results.length, 9)
  } else {
    loaded(0, 0)
  }
}

onBeforeMount(async () => {
  const { getCommentsPost } = useComment()

  comments.value = await getCommentsPost(
    post.value!.slug,
    page.value
  )
  useCommentStore().setComments(comments.value)
  loading.value = false
})
</script>

<template>
  <div class="relative">
    <div
      class="absolute top-0 left-0 w-full h-full flex flex-col pt-[10px]
        px-[10px] no-scrollbar overflow-y-scroll"
    >
      <div class="w-full italic font-semibold py-2 px-2">
        {{ post?.title }}
      </div>
      <div class="w-full flex flex-wrap z-10 bg-opacity-50">
        <div v-for="tag in post?.tags" :key="tag">
          <Tag size="medium">
            <span> {{ tag }} </span>
          </Tag>
        </div>
      </div>
      <CommentItem v-bind="captionComp" isCaption />
      <Loading v-if="loading" class="mt-10" />
      <Comment
        v-else
        v-for="comment in comments.results"
        :key="comment.id"
        :comment="comment"
      />
      <VueEternalLoading
        v-if="!loading"
        :load="load"
      ></VueEternalLoading>
    </div>
  </div>
</template>
