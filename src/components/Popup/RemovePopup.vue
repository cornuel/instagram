<script lang="ts" setup>
import Modal from '@/components/Modal/Modal.vue'

const emit = defineEmits(['remove', 'cancel'])
defineProps<{
  title: string
  desc: string
  yes: string
  no: string
}>()

const handleRemove = () => {
  emit('remove')
}
const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <Modal isPopup isShow>
    <div
      class="w-full max-w-[400px] bg-modal rounded-xl text-center
        overflow-hidden"
    >
      <div class="p-8">
        <span class="block text-xl">{{ title }}</span>
        <span class="block text-textColor-secondary">{{
          desc
        }}</span>
      </div>
      <div
        class="h-12 flex flex-center border-t border-separator-modal
          cursor-pointer select-none active:bg-[#e5e5e5] font-bold
          text-error"
        @click="handleRemove"
      >
        <span>{{ yes }}</span>
      </div>
      <div
        class="h-12 flex flex-center border-t border-separator-modal
          cursor-pointer select-none active:bg-[#e5e5e5]"
        @click="handleCancel"
      >
        <span>{{ no }}</span>
      </div>
    </div>
  </Modal>
</template>
