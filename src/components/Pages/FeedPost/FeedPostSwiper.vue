<script setup lang="ts">
import 'swiper/css'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { reactive, computed, ref } from 'vue'
import MultipleIcon from '@icons/multiple-active.svg'

import type { IPost } from '@/types'
import { inject } from 'vue'

const post = inject<IPost>('post')

const postSwiperOptions = reactive({
  modules: [Navigation, Pagination],
  slidesPerView: 1,
  slidesPerGroup: 1,
  spaceBetween: 0,
  allowTouchMove: true,
  navigation: {
    nextEl: `.navigation-next-${post!.id}`,
    prevEl: `.navigation-prev-${post!.id}`,
    disabledClass: `disabled-${post!.id}`
  },
  pagination: { clickable: true }
})

const loading = ref(true)

const handleLoad = () => {
  loading.value = false
}

const isMultipleImages = computed(() => {
  return post!.images.length > 1
})
</script>

<template>
  <div
    class="relative"
    id="post.id"
  >
    <Swiper
      v-bind="postSwiperOptions"
      class="relative border border-borderColor md:rounded-lg rounded-none"
    >
      <SwiperSlide
        v-for="item in post!.images"
        :key="item.image"
      >
        <div class="relative aspect-w-1 aspect-h-1 w-full overflow-hidden">
          <div
            class="absolute inset-0 w-full h-full bg-cover bg-center scale-150 blur-[50px]"
            :style="{ backgroundImage: `url(${item.thumbnail})` }"
          ></div>
          <!-- Thumbnail Image -->
          <img
            :src="item.thumbnail"
            alt=""
            @load="handleLoad()"
            class="absolute inset-0 h-full object-contain"
          />
          <!-- Original Image -->
          <img
            v-if="!loading"
            :src="item.image"
            alt=""
            class="absolute inset-0 h-full object-contain"
          />
        </div>
      </SwiperSlide>
    </Swiper>

    <div v-if="isMultipleImages">
      <div class="absolute top-2 right-2 z-10">
        <MultipleIcon class="fill-slate-50" />
      </div>
      <div
        :class="`navigation-prev-${post!.id} has-[disabled-${post!.id}]:hidden`"
        class="absolute px-2 py-4 top-1/2 left-0 -translate-y-1/2 opacity-60 cursor-pointer z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.2)]"
      >
        <fa
          :icon="['fas', 'circle-chevron-left']"
          class="text-2xl text-white drop-shadow-[0_0_7px_rgba(0,0,0,0.1)]"
        />
      </div>
      <div
        :class="`navigation-next-${post!.id} has-[disabled-${post!.id}]:hidden`"
        class="absolute px-2 py-4 top-1/2 right-0 -translate-y-1/2 opacity-60 cursor-pointer z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.2)]"
      >
        <fa
          :icon="['fas', 'circle-chevron-right']"
          class="text-2xl text-white drop-shadow-[0_0_7px_rgba(0,0,0,0.1)]"
        />
      </div>
    </div>
  </div>
</template>
