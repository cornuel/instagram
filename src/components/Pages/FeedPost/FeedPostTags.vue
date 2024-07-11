<script lang="ts" setup>
import Loading from '@/components/Utils/Loading.vue'
import Tag from '@/components/Atom/Tag.vue'
import Comment from '@/components/Molecules/Comment/Comment.vue'
import CommentItem from '@/components/Molecules/Comment/CommentItem.vue'
import VueEternalLoading from '@/helpers/VueEternalLoading.vue'
import type { LoadAction } from '@/types/vue-eternal'

import { ref, computed, onBeforeMount } from 'vue'
import type { IPost } from '@/types'

import { inject } from 'vue'

const post = inject<IPost>('post')

const showAllTags = ref(false)

const displayedTags = computed(() =>
  showAllTags.value ? post?.tags : post?.tags?.slice(0, 5)
)
</script>

<template>
  <div class="relative">
    <div class="flex justify-between align-middle pt-2">
      <div class="w-full flex flex-wrap z-10 bg-opacity-50">
        <div
          v-for="tag in displayedTags"
          :key="tag"
        >
          <RouterLink
            :to="{
              name: 'Tag',
              params: { tagname: tag.toLowerCase() }
            }"
          >
            <Tag size="medium">
              <span> {{ tag }} </span>
            </Tag>
          </RouterLink>
        </div>
        <p
          v-if="!showAllTags && post?.tags?.length! > 5"
          @click="showAllTags = true"
          class="cursor-pointer py-1"
        >
          ... more
        </p>
      </div>
    </div>
  </div>
</template>
