<script lang="ts" setup>
import EllipsisIcon from '@icons/ellipsis.svg'
import Avatar from '@/components/Atom/Avatar.vue'
import UiButton from '@/components/Atom/UiButton.vue'
import UnfollowPopup from '@/components/Popup/UnfollowPopup.vue'
import ActionsPopup from '@/components/Popup/ActionsPopup.vue'

import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '@/stores'
import { useFollow } from '@/composables'
import type { IAction } from '@/types'

const { viewedProfile, authenticatedProfile } = storeToRefs(
  useProfileStore()
)
const isLoadingFollow = ref(false)
const unfollowPopupActive = ref(false)
const actionsPopupActive = ref(false)

const userPostActions = computed(() => {
  if (
    authenticatedProfile.value?.id ==
    viewedProfile.value!.id
  )
    return [
      {
        title: 'Delete',
        classes: 'font-bold text-error',
        action: () => {}
      },
      {
        title: 'Edit'
      },
      {
        title: 'Hide like counts to others'
      },
      {
        title: 'Turn off commenting'
      },
      {
        title: 'Go to post'
      },
      {
        title: 'Copy link'
      },
      {
        title: 'Embed'
      },
      {
        title: 'Cancel',
        action: () => {
          actionsPopupActive.value = false
        }
      }
    ] as IAction[]
  else
    return [
      {
        title: 'Report',
        classes: 'font-bold text-error'
      },
      {
        title: 'Unfollow',
        classes: 'font-bold text-error',
        action: () => {
          unfollowPopupActive.value = true
        }
      },
      {
        title: 'Add to favorites'
      },
      {
        title: 'Cancel',
        action: () => {
          actionsPopupActive.value = false
        }
      }
    ] as IAction[]
})

const follow = async () => {
  // if (authenticatedProfile) {
  //   const { setFollow } = useFollow()
  //   isLoadingFollow.value = true
  //   await setFollow(authenticatedProfile.value!.id, viewedProfile.value!.id)
  //   isLoadingFollow.value = false
  //   viewedProfile.value!.isCurrentUserFollowing = true
  // }
}

const unfollow = async () => {
  // if (authenticatedProfile) {
  //   const { deleteFollow } = useFollow()
  //   unfollowPopupActive.value = false
  //   isLoadingFollow.value = true
  //   await deleteFollow(authenticatedProfile.value!.id, viewedProfile.value!.id)
  //   isLoadingFollow.value = false
  //   viewedProfile.value!.isCurrentUserFollowing = false
  // }
}
</script>

<template>
  <div
    class="flex items-center justify-between border-b
      border-borderColor"
  >
    <div class="flex items-center p-[10px]">
      <RouterLink
        :to="{
          name: 'Profile',
          params: { username: viewedProfile!.username }
        }"
      >
        <Avatar
          width="32"
          :avatar-url="viewedProfile!.profile_pic"
        />
      </RouterLink>
      <div class="ml-3 font-semibold leading-none">
        <RouterLink
          :to="{
            name: 'Profile',
            params: { username: viewedProfile!.username }
          }"
        >
          <span class="hover:opacity-60">{{
            viewedProfile!.username
          }}</span>
        </RouterLink>
        <template
          v-if="
            viewedProfile!.id != authenticatedProfile?.id &&
            viewedProfile!.isCurrentUserFollowing
          "
        >
          <span class="mx-1">•</span>
          <UiButton
            secondary
            variant="text"
            class="!p-0"
            @click="
              () => {
                unfollowPopupActive = true
              }
            "
            :is-disabled="isLoadingFollow"
            :is-loading="isLoadingFollow"
            >Đang theo dõi</UiButton
          >
        </template>
        <template
          v-if="
            viewedProfile!.id != authenticatedProfile?.id &&
            !viewedProfile!.isCurrentUserFollowing
          "
        >
          <span class="mx-1">•</span>
          <UiButton
            primary
            variant="text"
            class="!p-0"
            @click="follow"
            :is-disabled="isLoadingFollow"
            :is-loading="isLoadingFollow"
            >Follow</UiButton
          >
        </template>
      </div>
    </div>
    <div class="p-2 cursor-pointer">
      <EllipsisIcon
        @click="
          () => {
            actionsPopupActive = true
          }
        "
      />
    </div>
  </div>
  <UnfollowPopup
    v-if="unfollowPopupActive"
    :user="viewedProfile!"
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
  <ActionsPopup
    v-if="actionsPopupActive"
    :actions="userPostActions"
    :on-click-outside="
      () => {
        actionsPopupActive = false
      }
    "
  />
</template>
