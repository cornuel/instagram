<script lang="ts" setup>
import Avatar from '@/components/Atom/Avatar.vue'
import LayoutSelector from '@/components/Molecules/Layout/LayoutSelector.vue'
import { computed, nextTick } from 'vue'
import { storeToRefs } from 'pinia'

import { useSearchStore, useResizeStore, useTagStore } from '@/stores'

import { onBeforeRouteUpdate } from 'vue-router'

const { searchedPosts } = storeToRefs(useSearchStore())
const { dimensions } = storeToRefs(useResizeStore())

const { currentTag } = storeToRefs(useTagStore())

const isGeneralMobile = computed(() => {
  return dimensions.value.width < 736
})

onBeforeRouteUpdate(() => {
  nextTick(() => {
    window.scrollTo(0, 0)
  })
})
</script>

<template>
  <div
    id="tag-index"
    class="max-w-[935px] pt-[30px] px-0 min-[736px]:px-5 mx-auto box-content flex flex-col"
  >
    <div class="flex w-full px-4 min-[736px]:px-0">
      <div class="flex-[0_1] min-[736px]:flex-[1_1_0%]">
        <div class="relative flex justify-center mr-[30px]">
          <Avatar
            :width="isGeneralMobile ? '77' : '150'"
            :avatar-url="searchedPosts?.results?.[0]?.images?.[0]?.thumbnail"
            :title="currentTag?.name"
          />
        </div>
      </div>
      <div class="flex flex-col flex-[2_1_0%]">
        <div
          class="flex flex-col min-[736px]:flex-row items-start min-[736px]:items-center"
        >
          <div
            class="text-transparent bg-clip-text bg-gradient-to-r from-[#c128be] via-[#ea3469] to-[#ee8131]"
          >
            <div class="text-3xl min-[736px]:text-4xl font-light">
              {{ currentTag?.name }}
            </div>
          </div>
        </div>
        <div class="flex-col">
          <div class="text-sm pb-4">#{{ currentTag?.slug }}</div>
          <div class="text-base">
            <span
              class="font-semibold"
              :title="currentTag?.post_count?.toString()"
              >{{ currentTag?.post_count }}</span
            >
            <span class=""> posts</span>
          </div>
        </div>
      </div>
    </div>
    <LayoutSelector />
    <div>
      <RouterView />
    </div>
  </div>
</template>
