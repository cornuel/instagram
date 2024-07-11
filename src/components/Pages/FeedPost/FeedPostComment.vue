<script lang="ts" setup>
import Loading from '@/components/Utils/Loading.vue'
import Tag from '@/components/Atom/Tag.vue'
import Comment from '@/components/Molecules/Comment/Comment.vue'
import CommentItem from '@/components/Molecules/Comment/CommentItem.vue'
import VueEternalLoading from '@/helpers/VueEternalLoading.vue'
import type { LoadAction } from '@/types/vue-eternal'

import { ref, computed, onBeforeMount, onMounted } from 'vue'
import { useComment, useLike } from '@/composables'
import { storeToRefs } from 'pinia'
import { usePostStore, useCommentStore } from '@/stores'
import type { IPaginatedProfiles, IPost } from '@/types'

import { inject } from 'vue'

const post = inject<IPost>('post')
// const { comments } = storeToRefs(useCommentStore())
const loading = ref(true)
// const page = ref(1)

const captionComp = computed(() => ({
  id: 'caption',
  profile: post!.profile,
  body: post!.body,
  created: post!.created
}))

// async function load({ loaded }: LoadAction): Promise<void> {
//   const { getCommentsPost } = useComment()
//   if (comments.value?.next) {
//     page.value += 1
//     const loadedComments = await getCommentsPost(post!.slug, page.value)
//     if (loadedComments && loadedComments.results) {
//       // update next value
//       comments.value.next = loadedComments.next
//       // push new comments
//       if (comments.value.results) {
//         comments.value.results.push(...loadedComments.results)
//         comments.value.next = loadedComments.next
//       }
//       useCommentStore().setComments(comments.value)
//       loaded(comments.value.results?.length ?? 0, 9)
//     }
//   } else {
//     loaded(0, 0)
//   }
// }

onBeforeMount(async () => {
  // const { getCommentsPost } = useComment()

  // comments.value = await getCommentsPost(post!.slug, page.value)
  // if (comments.value?.results) {
  //   useCommentStore().setComments(comments.value)
  // }
  loading.value = false
})
</script>

<template>
  <div class="relative">
    <div
      class="w-full h-full flex flex-col px-1 no-scrollbar overflow-y-scroll"
    >
      <CommentItem
        v-bind="captionComp"
        isFeedPostCaption
      />
      <Loading
        v-if="loading"
        class="mt-10"
      />
      <RouterLink
        v-if="post?.comment_count > 0"
        :to="{
          name: 'Post',
          params: { postId: post!.slug }
        }"
      >
        View all comments
      </RouterLink>
      <CommentItem
        v-if="post?.top_comment"
        v-bind="post?.top_comment"
        isFeedPostTopComment
      />
      <RouterLink
        v-if="post?.comment_count === 0"
        :to="{
          name: 'Post',
          params: { postId: post!.slug }
        }"
      >
        <div class="mb-2">Add a comment</div>
      </RouterLink>
    </div>
  </div>
</template>
