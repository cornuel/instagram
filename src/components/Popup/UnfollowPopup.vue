<script lang="ts" setup>
import type { IProfile } from '@/types'
import ConfirmPopup from './ConfirmPopup.vue'
import Avatar from '@/components/Atom/Avatar.vue'

withDefaults(
  defineProps<{
    user: IProfile
    onConfirm?: Fn<any, any>
    onCancel?: Fn<any, any>
    onClickOutside?: Fn<any, any>
  }>(),
  {
    onConfirm: () => {},
    onCancel: () => {},
    onClickOutside: () => {}
  }
)
</script>

<template>
  <ConfirmPopup
    confirm-message="Unfollow"
    @confirm="onConfirm"
    @cancel="onCancel"
    @click-outside="onClickOutside"
  >
    <div class="flex flex-col flex-center">
      <Avatar width="90" :avatar-url="user.profile_pic" />
      <span class="text-center mt-6"
        >Unfollow @{{ user.username }}?</span
      >
    </div>
  </ConfirmPopup>
</template>
