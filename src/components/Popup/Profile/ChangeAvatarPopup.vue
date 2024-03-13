<script lang="ts" setup>
import Modal from '@/components/Modal/Modal.vue'

withDefaults(
  defineProps<{
    onUploadAvatar: Fn<any, any>
    onDeleteAvatar: Fn<any, any>
    onClose: Fn<any, any>
  }>(),
  {}
)
</script>

<template>
  <Modal isPopup isShow @click-outside="onClose">
    <div
      class="w-screen max-w-[400px] bg-modal rounded-xl text-center
        overflow-hidden"
    >
      <div class="p-6">
        <span class="text-xl">Change Profile Picture</span>
      </div>
      <span
        class="block p-[13px] border-t border-separator-modal
          active:bg-[#e5e5e5] cursor-pointer select-none font-bold
          text-buttonColor-primary"
        @click="onUploadAvatar"
        >Upload new picture
      </span>
      <span
        class="block p-[13px] border-t border-separator-modal
          active:bg-[#e5e5e5] cursor-pointer select-none font-bold
          text-error"
        @click="onDeleteAvatar"
        >Remove current picture
      </span>
      <span
        class="block p-[13px] border-t border-separator-modal
          active:bg-[#e5e5e5] cursor-pointer select-none"
        @click="onClose"
        >Cancel
      </span>
    </div>
  </Modal>
</template>
