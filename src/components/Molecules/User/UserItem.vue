<script lang="ts" setup>
import UiButton from '@/components/Atom/UiButton.vue'
import Avatar from '@/components/Atom/Avatar.vue'
import UnfollowPopup from '@/components/Popup/UnfollowPopup.vue'

import { ref } from 'vue'
import { useFollow } from '@/composables'
import type { IProfile } from '@/types'
import { useProfileStore } from '@/stores/profile'
import { storeToRefs } from 'pinia'

const { viewedProfile } = storeToRefs(useProfileStore())

const props = defineProps<{
  profile: IProfile
  authenticatedProfile: IProfile
}>()

const isLoadingFollow = ref(false)
const unfollowPopupActive = ref(false)

const follow = async () => {
  if (props.authenticatedProfile) {
    const { setFollow } = useFollow()
    const { increaseFollowingCount, decreaseFollowingCount } = useProfileStore()
    isLoadingFollow.value = true
    const res: string = await setFollow(props.profile.username)
    props.profile!.is_following = !props.profile!.is_following
    if (res.includes('following')) {
      increaseFollowingCount(viewedProfile.value!)
    } else {
      decreaseFollowingCount(viewedProfile.value!)
    }
    if (unfollowPopupActive.value) {
      unfollowPopupActive.value = false
    }
    isLoadingFollow.value = false
  }
}
</script>

<template>
  <div class="flex items-center py-2 px-4">
    <RouterLink
      :to="{
        name: 'Profile',
        params: { username: profile.username }
      }"
      class="user-avatar"
    >
      <Avatar
        width="45"
        :avatarUrl="profile.profile_pic"
      />
    </RouterLink>
    <div class="flex flex-col flex-grow ml-3">
      <span class="font-semibold">
        <RouterLink
          :to="{
            name: 'Profile',
            params: { username: profile.username }
          }"
        >
          {{ profile.username }}
        </RouterLink>
      </span>
      <span class="text-textColor-secondary">{{ profile.full_name }}</span>
    </div>
    <div
      class="user-follow"
      v-if="authenticatedProfile!.id != profile.id"
    >
      <UiButton
        secondary
        v-if="profile.is_following"
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
        :user="profile"
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
