<script lang="ts" setup>
import EllipsisIcon from '@icons/ellipsis.svg'
import Avatar from '@/components/Atom/Avatar.vue'
import UiButton from '@/components/Atom/UiButton.vue'
import UnfollowPopup from '@/components/Popup/UnfollowPopup.vue'
import ActionsPopup from '@/components/Popup/ActionsPopup.vue'
import RemovePopup from '@/components/Popup/RemovePopup.vue'

import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { IPost, IAction } from '@/types'

import {
  useProfileStore,
  usePostStore,
  useModalStore,
  useTagStore
} from '@/stores'

import { useFollow, usePost, useDownload } from '@/composables'

import router from '@/router'
import { useRoute } from 'vue-router'

const { postProfile, viewedProfile, authenticatedProfile } =
  storeToRefs(useProfileStore())
const { removePostPopupShow, showModal, showPostModal } =
  storeToRefs(useModalStore())

const { post } = storeToRefs(usePostStore())
const { downloadImages } = useDownload()

const isLoadingFollow = ref(false)
const unfollowPopupActive = ref(false)
const actionsPopupActive = ref(false)

const route = useRoute()
const currentRoute = route.name

// deletePost returns true if status code is 204
const deletePost = async () => {
  if (authenticatedProfile) {
    const { deletePost } = usePost()
    if (await deletePost(post.value?.slug!)) {
      const { decreasePostsCount } = useProfileStore()
      const { removePostfromUserPosts, removePostfromShowedPosts } =
        usePostStore()

      // update the post_count of the user
      decreasePostsCount()
      if (currentRoute == 'TagPosts') {
        const { currentTag } = storeToRefs(useTagStore())
        currentTag.value!.post_count--
      }
      // remove the posts from both showed and user posts
      removePostfromUserPosts(post.value!)
      removePostfromShowedPosts(post.value!)

      if (showModal.value && showPostModal.value) {
        showModal.value = false
        showPostModal.value = false
      }

      router.back()

      // router.push({
      //   name: 'Profile',
      //   params: {
      //     username: authenticatedProfile.value!.username
      //   }
      // })
      removePostPopupShow.value = false
    } else {
      console.log('Something went wrong when deleting this post.')
    }
  }
}

const unfollowComputedTitle = computed(() => {
  return postProfile.value?.is_following ? 'Unfollow' : 'Follow'
})

const unfollowComputedClasses = computed(() => {
  return postProfile.value?.is_following ? 'font-bold text-error' : ''
})

const userPostActions = computed(() => {
  if (authenticatedProfile.value?.id == postProfile.value!.id)
    return [
      {
        title: 'Delete',
        classes: 'font-bold text-error',
        action: () => {
          actionsPopupActive.value = false
          removePostPopupShow.value = true
        }
      },
      {
        title: 'Edit'
      },
      {
        title: 'Download photo(s)',
        action: () => {
          downloadImages(post.value as IPost)
        }
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
        title: unfollowComputedTitle.value,
        classes: unfollowComputedClasses.value,
        action: () => {
          if (postProfile.value?.is_following) {
            unfollowPopupActive.value = true
          } else {
            follow()
          }
        }
      },
      {
        title: 'Download photo(s)',
        action: () => {
          downloadImages(post.value as IPost)
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
  if (authenticatedProfile) {
    const { setFollow } = useFollow()
    const { increaseFollowingCount } = useProfileStore()
    isLoadingFollow.value = true
    const res: string = await setFollow(postProfile.value?.username!)
    if (res.includes('following')) {
      postProfile.value!.is_following = true
      increaseFollowingCount(viewedProfile.value!)
    }
    isLoadingFollow.value = false
  }
}

const unfollow = async () => {
  if (authenticatedProfile) {
    const { setFollow } = useFollow()
    const { decreaseFollowingCount } = useProfileStore()
    isLoadingFollow.value = true
    const res: string = await setFollow(postProfile.value?.username!)
    if (res.includes('unfollowed')) {
      postProfile.value!.is_following = false
      decreaseFollowingCount(viewedProfile.value!)
      if (unfollowPopupActive.value) {
        unfollowPopupActive.value = false
      }
    }
    isLoadingFollow.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-between border-b border-borderColor">
    <div class="flex items-center p-[10px]">
      <RouterLink
        :to="{
          name: 'Profile',
          params: { username: postProfile!.username }
        }"
      >
        <Avatar
          width="32"
          :avatar-url="postProfile!.profile_pic"
        />
      </RouterLink>
      <div class="ml-3 font-semibold leading-none">
        <RouterLink
          :to="{
            name: 'Profile',
            params: { username: postProfile!.username }
          }"
        >
          <span class="hover:opacity-60">{{ postProfile!.username }}</span>
        </RouterLink>
        <template
          v-if="
            postProfile!.id != authenticatedProfile?.id &&
            !postProfile!.is_following
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
  <RemovePopup
    v-if="removePostPopupShow"
    title="Delete post?"
    desc="Are you sure you want to delete this post?"
    yes="Delete"
    no="Cancel"
    @remove="deletePost"
    @cancel="
      () => {
        removePostPopupShow = false
      }
    "
  />
  <UnfollowPopup
    v-if="unfollowPopupActive"
    :user="postProfile!"
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
