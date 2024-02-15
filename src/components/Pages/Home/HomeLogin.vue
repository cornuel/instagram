<script lang="ts" setup>
import Login from '@/components/Pages/Auth/Login.vue'

import { ref, onMounted, onBeforeUnmount } from 'vue'

const index = ref(1)

let interval: any

onMounted(() => {
  interval = setInterval(() => {
    if (index.value >= 4) index.value = 1
    else index.value++
  }, 5000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="w-full my-8 max-[400px]:my-0">
    <div class="flex flex-center xl:mr-48">
      <div class="home-phone min-[200px]:flex hidden mr-6 mb-3">
        <div
          class="relative w-[260px] mt-[25px] ml-[110px] mr-[18px]"
        >
          <img
            class="screenshot absolute top-0 right-0 opacity-0 has-[active]:opacity-100
              transition-opacity duration-[1500ms] ease-out"
            :class="{ active: index == 1 }"
            src="@/assets/images/screenshot1.png"
            alt="Screenshot 1"
          />
          <img
            class="absolute top-0 right-0 opacity-0 has-[active]:opacity-100
              transition-opacity duration-[1500ms] ease-out"
            :class="{ active: index == 2 }"
            src="@/assets/images/screenshot2.png"
            alt="Screenshot 2"
          />
          <img
            class="absolute top-0 right-0 opacity-0 has-[active]:opacity-100
              transition-opacity duration-[1500ms] ease-out"
            :class="{ active: index == 3 }"
            src="@/assets/images/screenshot3.png"
            alt="Screenshot 3"
          />
          <img
            class="absolute top-0 right-0 opacity-0 has-[active]:opacity-100
              transition-opacity duration-[1500ms] ease-out"
            :class="{ active: index == 4 }"
            src="@/assets/images/screenshot4.png"
            alt="Screenshot 4"
          />
        </div>
      </div>
      <Login />
    </div>
  </div>
</template>

<style scoped>
.home-phone {
  height: 580px;
  width: 380px;
  background-image: url('@/assets/images/home-phones.png');
  background-size: 464.5px 634px;
  background-position-x: -45px;
}
</style>
