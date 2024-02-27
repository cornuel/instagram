<script lang="ts" setup>
import UiButton from '@/components/Atom/UiButton.vue'
import Avatar from '@/components/Atom/Avatar.vue'
import UnfollowPopup from '@/components/Popup/UnfollowPopup.vue'

import { ref } from 'vue'
import { useFollow } from '@/composables'
import type { IProfile } from '@/types'

const props = defineProps<{
  viewedProfile: IProfile
  authenticatedProfile: IProfile
}>()

const isLoadingFollow = ref(false)
const unfollowPopupActive = ref(false)

const follow = async () => {
  // if (props.currentUser) {
  //   const { setFollow } = useFollow()
  //   isLoadingFollow.value = true
  //   await setFollow(props.currentUser.id, props.user.id)
  //   isLoadingFollow.value = false
  //   props.user!.isCurrentUserFollowing = true
  // }
}

const unfollow = async () => {
  // if (props.currentUser) {
  //   const { deleteFollow } = useFollow()
  //   unfollowPopupActive.value = false
  //   isLoadingFollow.value = true
  //   await deleteFollow(props.currentUser.id, props.user.id)
  //   isLoadingFollow.value = false
  //   props.user!.isCurrentUserFollowing = false
  // }
}
</script>

<template>
  <div class="flex items-center py-2 px-4">
    <RouterLink
      :to="{
        name: 'Profile',
        params: { username: viewedProfile.username }
      }"
      class="user-avatar"
    >
      <Avatar
        width="45"
        :avatarUrl="viewedProfile.profile_pic"
      />
    </RouterLink>
    <div class="flex flex-col flex-grow ml-3">
      <span class="font-semibold">
        <RouterLink
          :to="{
            name: 'Profile',
            params: { username: viewedProfile.username }
          }"
        >
          {{ viewedProfile.username }}
        </RouterLink>
      </span>
      <span class="text-textColor-secondary">{{
        viewedProfile.full_name
      }}</span>
    </div>
    <div
      class="user-follow"
      v-if="authenticatedProfile!.id != viewedProfile.id"
    >
      <UiButton
        secondary
        v-if="viewedProfile.isCurrentUserFollowing"
        :isDisabled="isLoadingFollow"
        :isLoading="isLoadingFollow"
        @click="
          () => {
            unfollowPopupActive = true
          }
        "
      >
        <span>Đang theo dõi</span>
      </UiButton>
      <UiButton
        primary
        :isDisabled="isLoadingFollow"
        :isLoading="isLoadingFollow"
        @click="follow"
      >
        <span>Follow</span>
      </UiButton>
      <UnfollowPopup
        v-if="unfollowPopupActive"
        :user="viewedProfile"
        :onConfirm="unfollow"
        :onCancel="
          () => {
            unfollowPopupActive = false
          }
        "
        :onClickOutside="
          () => {
            unfollowPopupActive = false
          }
        "
      />
    </div>
  </div>
</template>
