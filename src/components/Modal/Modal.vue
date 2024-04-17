<script lang="ts" setup>
import { onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/stores'

const emit = defineEmits(['click-outside'])
withDefaults(
  defineProps<{
    isPopup?: boolean
    isShow?: boolean
    isPost?: boolean
  }>(),
  {
    isPopup: false,
    isShow: false,
    isPost: false
  }
)

const { scrollPosition } = storeToRefs(useModalStore())

const handleClickOutsideModal = () => {
  emit('click-outside')
}

// onMounted(() => {
//   if (props.isShow) {
//     scrollPosition.value = document.documentElement.scrollTop
//     // stopScroll.value = true
//   }
// })

onUnmounted(() => {
  // if (!document.querySelector('#modal > div') && !document.querySelector('#popup > div')) {
  //   stopScroll.value = false
  // }
  setTimeout(() => {
    document.documentElement.scrollTop = scrollPosition.value
  }, 0)
})
</script>

<template>
  <Teleport :to="isPopup ? '#popup' : '#modal'">
    <Transition name="modal">
      <div
        v-if="isShow"
        class="fixed bottom-0 left-0 right-0 top-0 flex bg-[#0000004d] flex-center"
        :class="isPopup ? 'z-50' : 'z-40'"
      >
        <div
          class="m-5 flex w-screen flex-center min-[500px]:w-auto"
          v-click-outside="handleClickOutsideModal"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
