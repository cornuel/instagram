<script lang="ts" setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { reactive, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostStore } from '@/stores'

const { post } = storeToRefs(usePostStore())

const postSwiperOptions = reactive({
  modules: [Navigation, Pagination],
  slidesPerView: 1,
  slidesPerGroup: 1,
  spaceBetween: 0,
  allowTouchMove: true,
  navigation: {
    nextEl: '.navigation-next',
    prevEl: '.navigation-prev',
    disabledClass: 'disabled'
  },
  pagination: { clickable: true }
})

const loading = ref(true)

const handleLoad = () => {
  loading.value = false
}

const isMultipleImages = computed(() => {
  return post.value!.images.length > 1
})
</script>

<template>
  <div class="relative">
    <Swiper
      v-bind="postSwiperOptions"
      class="relative"
    >
      <SwiperSlide
        v-for="item in post!.images"
        :key="item.image"
      >
        <div class="relative aspect-w-1 aspect-h-1 w-full">
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
      <div
        class="absolute px-2 py-4 top-1/2 left-0 -translate-y-1/2 opacity-60 cursor-pointer z-10 has-[disabled]:hidden navigation-prev drop-shadow-[0_0_10px_rgba(0,0,0,0.2)]"
      >
        <fa
          :icon="['fas', 'circle-chevron-left']"
          class="text-2xl text-white drop-shadow-[0_0_7px_rgba(0,0,0,0.1)]"
        />
      </div>
      <div
        class="absolute px-2 py-4 top-1/2 right-0 -translate-y-1/2 opacity-60 cursor-pointer z-10 has-[disabled]:hidden navigation-next drop-shadow-[0_0_10px_rgba(0,0,0,0.2)]"
      >
        <fa
          :icon="['fas', 'circle-chevron-right']"
          class="text-2xl text-white drop-shadow-[0_0_7px_rgba(0,0,0,0.1)]"
        />
      </div>
    </div>
  </div>
</template>
