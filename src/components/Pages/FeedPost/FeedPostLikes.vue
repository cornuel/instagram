<script lang="ts" setup>
import { ref, computed, onBeforeMount, watch } from 'vue'
import { useLike } from '@/composables'
import { usePostStore } from '@/stores'
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

const handleClickLikedPost = async () => {
  if (post?.like_count === 0) return
  const { setLikedListModal, setIsLoadingLikedList, setLikedList } =
    usePostStore()
  const { getLikedUsers } = useLike()
  const { setPost } = usePostStore()

  setPost(post!)

  setLikedListModal(true)
  setIsLoadingLikedList(true)
  const likedUsers = (await getLikedUsers(
    1,
    post!.slug,
    'post'
  )) as IPaginatedProfiles
  setLikedList(likedUsers.results)
  setIsLoadingLikedList(false)
}

const likeCount = computed(() => {
  return post?.like_count
})

const likeText = computed(() => {
  return post?.like_count === 1 || post?.like_count === 0 ? 'like' : 'likes'
})

watch(likeCount, (newCOunt, oldCount) => {
  console.log(newCOunt, oldCount)
})

onBeforeMount(async () => {
  loading.value = false
})
</script>

<template>
  <div class="relative">
    <div class="flex justify-between align-middle py-1 px-1">
      <div
        class="text-base whitespace-nowrap font-semibold"
        :class="{
          'cursor-pointer': post!.like_count > 0
        }"
        @click="handleClickLikedPost"
      >
        <!-- <div class="mr-3">
          <Avatar
            width="32"
            :avatar-url="post.?.profile_pic"
          />
        </div> -->
        {{ post!.like_count.toLocaleString('en-US').replace(',', '.') }}
        {{ likeText }}
      </div>
    </div>
  </div>
</template>
