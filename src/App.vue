<script setup lang="ts">
import LoadingProgress from '@/components/Utils/LoadingProgress.vue'
import Splash from '@/components/Utils/Splash.vue'

import { RouterView, useRoute } from 'vue-router'
import { watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useModalStore,
  useProfileStore,
  useThemeStore,
  useResizeStore,
  useLoadingStore
} from '@/stores'
import { useResize } from '@/composables'

useResize()
const route = useRoute()
const { stopScroll } = storeToRefs(useModalStore())
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

watch(stopScroll, (active) => {
  document.documentElement.style.overflow = active ? 'hidden' : 'visible'
})

const token = useProfileStore().getToken();
if (token) {
  useProfileStore().setAxiosAuthHeader(token);
}

</script>

<template>
  <div
    class="has-[active-overlay]:overflow-y-scroll"
    :class="[{ 'active-overlay': stopScroll }, screen]"
  >
    <Splash v-if="isLoadingSplash" />
    <KeepAlive>
      <Component :is="route.meta.layout || 'div'">
        <LoadingProgress />

        <RouterView />
      </Component>
    </KeepAlive>
  </div>
</template>
