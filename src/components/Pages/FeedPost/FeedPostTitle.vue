<script lang="ts" setup>
import { ref, computed, onBeforeMount } from 'vue'
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

onBeforeMount(async () => {
  loading.value = false
})
</script>

<template>
  <div class="relative">
    <div class="flex justify-between align-middle px-1">
      <div class="w-full font-semibold">
        {{ post?.title }}
      </div>
    </div>
  </div>
</template>
