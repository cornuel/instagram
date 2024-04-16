<script lang="ts" setup>
import ArrowBackIcon from '@icons/arrowback.svg'
import Modal from './Modal.vue'
import UiButton from '@/components/Atom/UiButton.vue'
import InitPost from '@/components/Pages/CreatePost/InitPost.vue'
import EditorPost from '@/components/Pages/CreatePost/EditorPost.vue'
import UploadPost from '@/components/Pages/CreatePost/UploadPost.vue'
import RemovePopup from '@/components/Popup/RemovePopup.vue'

import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useCreatePostStore, useModalStore } from '@/stores'

defineProps<{
  onClickOutside: Fn<any, any>
}>()

const { removeMediaPopupShow, removePostPopupShow, modalCreatePostShow } =
  storeToRefs(useModalStore())
const { currentTab, currentMediaIndex, title } =
  storeToRefs(useCreatePostStore())

const isClickBackFromEditor = ref(false)

const isShowButton = computed(() => {
  return !['InitPost', 'UploadPost'].includes(currentTab.value)
})

const handlePrevTab = () => {
  const { prevTab } = useCreatePostStore()

  if (currentTab.value == 'EditorPost') {
    isClickBackFromEditor.value = true
    removePostPopupShow.value = true
  } else {
    isClickBackFromEditor.value = false
    prevTab()
  }
}

const handleNextTab = () => {
  const { nextTab } = useCreatePostStore()
  nextTab()
}

const handleRemovePost = () => {
  const { resetCreatePost, prevTab } = useCreatePostStore()

  if (isClickBackFromEditor.value) {
    removePostPopupShow.value = false
    prevTab()
  } else {
    removePostPopupShow.value = false
    modalCreatePostShow.value = false
  }

  setTimeout(() => {
    resetCreatePost()
  }, 0)
}

const hanldeRemoveMedia = () => {
  const { deleteMedia } = useCreatePostStore()

  deleteMedia(currentMediaIndex.value)
  removeMediaPopupShow.value = false
}

watch(currentTab, () => {
  switch (currentTab.value) {
    case 'InitPost':
      title.value = 'Create new post'
      break
    case 'EditorPost':
      title.value = 'Crop'
      break
    case 'FilterPost':
      title.value = 'Edit'
      break
    case 'CaptionPost':
      title.value = 'Create new post'
      break
    case 'UploadPost':
      title.value = 'Uploading'
      break
    default:
      title.value = ''
  }
})

onBeforeUnmount(() => {
  const { resetCreatePost } = useCreatePostStore()
  resetCreatePost()
})
</script>

<template>
  <Modal
    isShow
    @click-outside="onClickOutside"
  >
    <div
      class="flex flex-col flex-nowrap w-fit h-[calc(100vh-40px)] max-h-[442px] bg-modal rounded-xl overflow-hidden select-none"
    >
      <!-- TOPBAR -->
      <div
        class="relative flex items-center justify-between h-[42px] border-b border-separator-modal"
      >
        <div
          v-if="isShowButton"
          class="ml-2 p-2 cursor-pointer select-none"
          @click="handlePrevTab"
        >
          <ArrowBackIcon
            class="text-textColor-primary fill-textColor-primary"
          />
        </div>
        <span
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-semibold whitespace-nowrap"
          >{{ title }}</span
        >
        <UiButton
          v-if="isShowButton"
          variant="text"
          @click="handleNextTab"
        >
          <span class="text-buttonColor-primary select-none hover:text-link">{{
            currentTab != 'CaptionPost' ? 'Next' : 'Share'
          }}</span>
        </UiButton>
      </div>
      <div class="max-h-[400px] h-screen">
        <InitPost v-if="currentTab == 'InitPost'" />
        <UploadPost v-else-if="currentTab == 'UploadPost'" />
        <EditorPost v-else />
      </div>
    </div>
  </Modal>

  <RemovePopup
    v-if="removePostPopupShow"
    title="Discard post?"
    desc="If you leave, your edits won't be saved."
    yes="Discard"
    no="Cancel"
    @remove="handleRemovePost"
    @cancel="
      () => {
        removePostPopupShow = false
      }
    "
  />
  <RemovePopup
    v-if="removeMediaPopupShow"
    title="Remove image?"
    desc="This action will remove the image from your post."
    yes="Discard"
    no="Cancel"
    @remove="hanldeRemoveMedia"
    @cancel="
      () => {
        removePostPopupShow = false
      }
    "
  />
</template>
