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
  if (props.authenticatedProfile) {
    const { setFollow } = useFollow()
    isLoadingFollow.value = true
    await setFollow(props.viewedProfile.username)
    isLoadingFollow.value = false
    props.viewedProfile!.is_following =
      !props.viewedProfile!.is_following

    if (unfollowPopupActive.value) {
      unfollowPopupActive.value = false
    }
  }
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
        v-if="viewedProfile.is_following"
        :isDisabled="isLoadingFollow"
        :isLoading="isLoadingFollow"
        @click="
          () => {
            unfollowPopupActive = true
          }
        "
      >
        <span>Following</span>
      </UiButton>
      <UiButton
        v-else
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
        :onConfirm="follow"
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
