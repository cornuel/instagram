<script setup lang="ts">
import LoadingProgress from '@/components/Utils/LoadingProgress.vue'
import Splash from '@/components/Utils/Splash.vue'
import FullSizeModal from '@/components/Modal/FullSizeModal.vue'

import { RouterView, useRoute } from 'vue-router'
import { watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useModalStore,
  useThemeStore,
  useResizeStore,
  useLoadingStore
} from '@/stores'
import { useResize } from '@/composables'

useResize()
const route = useRoute()
const { stopScroll, showModal, showPostModal } = storeToRefs(useModalStore())
const { darkMode } = storeToRefs(useThemeStore())
const { screen } = storeToRefs(useResizeStore())
const { isLoadingSplash } = storeToRefs(useLoadingStore())

watch(darkMode, (newTheme) => {
  if (newTheme) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
})

onMounted(() => {
  if (darkMode.value) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
})

// watch(stopScroll, (active) => {
//   document.documentElement.style.overflow = active ? 'hidden' : 'visible'
// })

const handleClickOutside = () => {
  showModal.value = false
}

// watch(
//   () => route.path,
//   () => {
//     console.log('---------------------------------------')
//     route.matched.forEach((item) => {
//       console.log(item.path, item.name)
//       console.log('\tdefault = ', item.components?.default?.__name)
//       if (item.components?.modal) console.log('\tmodal = ', item.components?.modal.__name)
//     })
//     Object.entries(route.params).forEach(([key, value]) => {
//       console.log(`${key}: ${value}`)
//     })
//   }
// )
</script>

<template>
  <div
    class="has-[active-overlay]:overflow-y-scroll"
    :class="[{ 'active-overlay': stopScroll }, screen]"
  >
    <Splash v-if="isLoadingSplash" />
    <!-- <KeepAlive> -->
    <Component :is="route.meta.layout || 'div'">
      <LoadingProgress />
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </Component>
    <!-- </KeepAlive> -->

    <router-view
      v-slot="{ Component }"
      name="modal"
    >
      <Transition
        :duration="200"
        name="nested"
      >
        <FullSizeModal
          v-if="showModal"
          :component="Component"
          @click-outside="handleClickOutside"
        >
          <component
            v-if="showPostModal"
            :is="Component"
          />
        </FullSizeModal>
      </Transition>
    </router-view>

    <!-- <router-view name="popup"></router-view> -->
  </div>
</template>

<style>
.nested-enter-active .inner {
  transition: all 0.2s ease-in-out;
  opacity: 1;
}
.nested-leave-active .inner {
  transition: all 0.2s ease-in-out;
  opacity: 1;
}

.nested-enter-from .inner {
  transform: scale(0.8);
  opacity: 0;
}
.nested-leave-to .inner {
  transform: scale(0.6);
  opacity: 0;
}
</style>
