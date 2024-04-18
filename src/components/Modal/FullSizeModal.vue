<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useModalStore, usePostStore } from '@/stores'
import CrossMarkIcon from '@icons/cross.svg'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import router from '@/router'

const emit = defineEmits(['click-outside'])

withDefaults(
  defineProps<{
    isPopup?: boolean
    isShow?: boolean
    component?: any
  }>(),
  {
    isPopup: false,
    isShow: false,
    component: null
  }
)

const { showModal, showPostModal } = storeToRefs(useModalStore())
const { likedListModal } = storeToRefs(usePostStore())

const handleClickOutsideModal = () => {
  showPostModal.value = false
  router.back()
  emit('click-outside')
}

onBeforeRouteLeave(() => {
  showPostModal.value = false
  showModal.value = false
  likedListModal.value = false
})
onBeforeRouteUpdate(() => {
  // scrollPosition.value = document.getElementById("tag-index").scrollTop // save scroll
  // document.getElementById("tag-index").scrollTop = 0 // reset scroll
  showPostModal.value = false
  showModal.value = false
  likedListModal.value = false
})
</script>

<template>
  <div
    class="inner fixed bottom-0 left-0 right-0 top-0 flex bg-[#000000aa] flex-center"
    :class="isPopup ? 'z-50' : 'z-40'"
  >
    <div
      class="flex max-h-[80vh] w-screen max-w-[89vw] rounded-xl flex-center"
      v-click-outside="handleClickOutsideModal"
    >
      <CrossMarkIcon
        class="delay-80 absolute right-0 top-0 mr-8 mt-6 h-6 w-6 fill-textColor-secondary text-[#ffffff] transition duration-300 ease-in-out hover:cursor-pointer hover:text-red-500"
        @click="handleClickOutsideModal"
      />
      <div class="w-screen inner">
        <component :is="component" />
      </div>
    </div>
  </div>
</template>
