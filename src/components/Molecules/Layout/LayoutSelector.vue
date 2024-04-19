<script setup lang="ts">
import LayoutDetailedIcon from '@icons/layoutDetailed.svg'
import LayoutDetailedActiveIcon from '@icons/layoutDetailed-active.svg'
import LayoutMediumIcon from '@icons/layoutMedium.svg'
import LayoutMediumActiveIcon from '@icons/layoutMedium-active.svg'
import LayoutMosaicIcon from '@icons/layoutMosaic.svg'
import LayoutMosaicActiveIcon from '@icons/layoutMosaic-active.svg'

import { useLayoutStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { selectedLayout } = storeToRefs(useLayoutStore())
const { setPostLayout } = useLayoutStore()

const handleLayout = (mode: 'detailed' | 'medium' | 'mosaic') => {
  setPostLayout(mode)
}
</script>

<template>
  <div class="flex justify-end">
    <div class="p-2 cursor-pointer select-none">
      <LayoutDetailedIcon
        v-if="selectedLayout !== 'detailed'"
        class="w-6 h-6 text-textColor-secondary"
        @click="handleLayout('detailed')"
      />
      <LayoutDetailedActiveIcon
        v-else
        class="w-6 h-6 animate-[0.45s_like-button-animation_ease-out]"
      />
    </div>
    <div class="p-2 cursor-pointer select-none">
      <LayoutMediumIcon
        v-if="selectedLayout !== 'medium'"
        class="w-6 h-6 text-textColor-secondary"
        @click="handleLayout('medium')"
      />
      <LayoutMediumActiveIcon
        v-else
        class="w-6 h-6 animate-[0.45s_like-button-animation_ease-out]"
      />
    </div>
    <div class="p-2 cursor-pointer select-none">
      <LayoutMosaicIcon
        v-if="selectedLayout !== 'mosaic'"
        class="w-6 h-6 text-textColor-secondary"
        @click="handleLayout('mosaic')"
      />
      <LayoutMosaicActiveIcon
        v-else
        class="w-6 h-6 animate-[0.45s_like-button-animation_ease-out]"
      />
    </div>
  </div>
</template>
