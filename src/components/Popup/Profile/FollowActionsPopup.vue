<script lang="ts" setup>
import CloseIcon from '@icons/x-mark.svg'
import StarIcon from '@icons/star.svg'
import StarActiveIcon from '@icons/star-active.svg'
import Modal from '@/components/Modal/Modal.vue'
import Avatar from '@/components/Atom/Avatar.vue'

import { ref } from 'vue'
import type { IProfile } from '@/types'

const emit = defineEmits(['open-restriction-popup'])
defineProps<{
  profile: IProfile

  onUnfollow: Fn<any, any>
  onClose: Fn<any, any>
  onClickOutside: Fn<any, any>
}>()

const isCloseFriend = ref(false)
const isFavorite = ref(false)

const openRestrictionPopup = () => {
  emit('open-restriction-popup')
}
</script>

<template>
  <Modal isPopup isShow @click-outside="onClickOutside">
    <div
      class="flex flex-col flex-center w-screen max-w-[400px] bg-modal rounded-xl overflow-hidden"
    >
      <div class="relative w-full p-4 flex flex-col flex-center border-b border-separator-modal">
        <Avatar width="58" :avatar-url="profile.profile_pic" />
        <span class="font-semibold">{{ profile.username }}</span>
        <div class="absolute top-1 right-2 p-2 cursor-pointer" @click="onClose">
          <CloseIcon />
        </div>
      </div>
      <div
        class="flex w-full p-4 hover:bg-[#e5e5e5] border-b border-separator-modal cursor-pointer select-none"
        @click="
          () => {
            isCloseFriend = !isCloseFriend
          }
        "
      >
        <span class="flex-grow mr-3 leading-tight">{{
          isCloseFriend ? 'Add to close friend' : 'Add to close friends list'
        }}</span>
        <div
          class="flex flex-center w-5 h-5 rounded-full border"
          :class="isCloseFriend ? 'border-[#1cd14f] bg-[#1cd14f]' : 'border-textColor-primary'"
        >
          <fa class="w-3 h-3" :class="{ 'text-white': isCloseFriend }" :icon="['fas', 'star']" />
        </div>
      </div>
      <div
        class="flex w-full p-4 hover:bg-[#e5e5e5] border-b border-separator-modal cursor-pointer select-none"
        @click="
          () => {
            isFavorite = !isFavorite
          }
        "
      >
        <span class="flex-grow mr-3 leading-tight">{{
          isFavorite ? 'Remove from favorites' : 'Add to favorites'
        }}</span>
        <StarActiveIcon v-if="isFavorite" />
        <StarIcon v-else />
      </div>
      <div
        class="flex w-full p-4 hover:bg-[#e5e5e5] border-b border-separator-modal cursor-pointer select-none"
      >
        <span class="flex-grow mr-3 leading-tight">Mute</span>
        <fa class="text-textColor-secondary w-4" :icon="['fas', 'chevron-right']" />
      </div>
      <div
        class="flex w-full p-4 hover:bg-[#e5e5e5] border-b border-separator-modal cursor-pointer select-none"
        @click="openRestrictionPopup"
      >
        <span class="flex-grow mr-3 leading-tight">Restrict</span>
        <fa class="text-textColor-secondary w-4" :icon="['fas', 'chevron-right']" />
      </div>
      <div
        class="flex w-full p-4 hover:bg-[#e5e5e5] cursor-pointer select-none"
        @click="onUnfollow"
      >
        <span class="flex-grow mr-3 leading-tight">Unfollow</span>
      </div>
    </div>
  </Modal>
</template>
