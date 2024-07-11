<script setup lang="ts">
import LayoutDetailedIcon from '@icons/layoutDetailed.svg'
import LayoutDetailedActiveIcon from '@icons/layoutDetailed-active.svg'
import LayoutMediumIcon from '@icons/layoutMedium.svg'
import LayoutMediumActiveIcon from '@icons/layoutMedium-active.svg'
import LayoutMosaicIcon from '@icons/layoutMosaic.svg'
import LayoutMosaicActiveIcon from '@icons/layoutMosaic-active.svg'
import LayoutMonoIcon from '@icons/layoutMono.svg'
import LayoutMonoActiveIcon from '@icons/layoutMono-active.svg'

import { useLayoutStore } from '@/stores'
import { storeToRefs } from 'pinia'

const props = defineProps({
  type: {
    type: String,
    validator: (value: string) => ['review', 'feed'].includes(value),
    required: true
  }
})

const { selectedLayout, feedLayout } = storeToRefs(useLayoutStore())
const { setPostLayout, setFeedLayout } = useLayoutStore()

const handleLayout = (
  mode: 'detailed' | 'medium' | 'mosaic' | 'single' | 'double'
) => {
  if (props.type === 'review') {
    setPostLayout(mode as 'detailed' | 'medium' | 'mosaic')
  } else if (props.type === 'feed') {
    setFeedLayout(mode as 'single' | 'double')
  }
}
</script>

<template>
  <div
    v-if="type === 'review'"
    class="flex justify-end"
  >
    <div class="p-2 cursor-pointer select-none">
      <LayoutDetailedIcon
        v-if="selectedLayout !== 'detailed'"
        class="w-10 h-10 text-textColor-secondary"
        @click="handleLayout('detailed')"
      />
      <LayoutDetailedActiveIcon
        v-else
        class="w-10 h-10 animate-[0.45s_like-button-animation_ease-out] fill-textColor-primary"
      />
    </div>
    <div class="p-2 cursor-pointer select-none">
      <LayoutMediumIcon
        v-if="selectedLayout !== 'medium'"
        class="w-10 h-10 text-textColor-secondary"
        @click="handleLayout('medium')"
      />
      <LayoutMediumActiveIcon
        v-else
        class="w-10 h-10 animate-[0.45s_like-button-animation_ease-out] fill-textColor-primary"
      />
    </div>
    <div class="p-2 cursor-pointer select-none">
      <LayoutMosaicIcon
        v-if="selectedLayout !== 'mosaic'"
        class="w-10 h-10 text-textColor-secondary"
        @click="handleLayout('mosaic')"
      />
      <LayoutMosaicActiveIcon
        v-else
        class="w-10 h-10 animate-[0.45s_like-button-animation_ease-out] fill-textColor-primary"
      />
    </div>
  </div>
  <div
    v-if="type === 'feed'"
    class="flex justify-end"
  >
    <div class="p-2 cursor-pointer select-none">
      <LayoutMonoIcon
        v-if="feedLayout !== 'single'"
        class="w-10 h-10 text-textColor-secondary"
        @click="handleLayout('single')"
      />
      <LayoutMonoActiveIcon
        v-else
        class="w-10 h-10 animate-[0.45s_like-button-animation_ease-out] fill-textColor-primary"
      />
    </div>
    <div class="p-2 cursor-pointer select-none">
      <LayoutMediumIcon
        v-if="feedLayout !== 'double'"
        class="w-10 h-10 text-textColor-secondary"
        @click="handleLayout('double')"
      />
      <LayoutMediumActiveIcon
        v-else
        class="w-10 h-10 animate-[0.45s_like-button-animation_ease-out] fill-textColor-primary"
      />
    </div>
  </div>
</template>
