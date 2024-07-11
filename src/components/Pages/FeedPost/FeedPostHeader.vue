<script lang="ts" setup>
import EllipsisIcon from '@icons/ellipsis.svg'
import Avatar from '@/components/Atom/Avatar.vue'
import UiButton from '@/components/Atom/UiButton.vue'
import UnfollowPopup from '@/components/Popup/UnfollowPopup.vue'
import ActionsPopup from '@/components/Popup/ActionsPopup.vue'
import RemovePopup from '@/components/Popup/RemovePopup.vue'

import { ref, computed, inject, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import type { IPost, IAction, IProfile } from '@/types'

import {
  useProfileStore,
  usePostStore,
  useModalStore,
  useTagStore
} from '@/stores'

import { useFollow, usePost, useDownload } from '@/composables'
import { dateDistanceToNow, convertToFullDate } from '@/helpers'

import router from '@/router'
import { useRoute } from 'vue-router'

const { feedProfiles, viewedProfile, authenticatedProfile } =
  storeToRefs(useProfileStore())
const { removePostPopupShow, showModal, showPostModal } =
  storeToRefs(useModalStore())

const post = inject<IPost>('post')
const { getProfilefromFeedProfiles } = useProfileStore()
const isLoading = ref(true)

let postProfile: Nullable<IProfile> = null

const getPostProfile = async () => {
  try {
    postProfile = await getProfilefromFeedProfiles(post!.profile)
    isLoading.value = false
  } catch (error) {
    console.log(error)
  }
}

const { downloadImages } = useDownload()

const isLoadingFollow = ref(false)
const unfollowPopupActive = ref(false)
const actionsPopupActive = ref(false)

const route = useRoute()
const currentRoute = route.name

const createdTimeComp = computed(() =>
  dateDistanceToNow(post?.created!, false, false)
)
const fullCreatedAtComp = computed(() =>
  convertToFullDate(post?.created!).toUpperCase()
)

// deletePost returns true if status code is 204
const deletePost = async () => {
  if (authenticatedProfile) {
    const { deletePost } = usePost()
    if (await deletePost(post?.slug!)) {
      const { decreasePostsCount } = useProfileStore()
      const { removePostfromUserPosts, removePostfromShowedPosts } =
        usePostStore()

      // update the posts_count of the user
      decreasePostsCount()
      if (currentRoute == 'TagPosts') {
        const { currentTag } = storeToRefs(useTagStore())
        currentTag.value!.posts_count--
      }
      // remove the posts from both showed and user posts
      removePostfromUserPosts(post!)
      removePostfromShowedPosts(post!)

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
  return postProfile?.is_following ? 'Unfollow' : 'Follow'
})

const unfollowComputedClasses = computed(() => {
  return postProfile?.is_following ? 'font-bold text-error' : ''
})

const userPostActions = computed(() => {
  if (authenticatedProfile.value?.id == postProfile!.id)
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
          downloadImages(post as IPost)
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
          if (postProfile?.is_following) {
            unfollowPopupActive.value = true
          } else {
            follow()
          }
        }
      },
      {
        title: 'Download photo(s)',
        action: () => {
          downloadImages(post as IPost)
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
    const res: string = await setFollow(postProfile?.username!)
    if (res.includes('following')) {
      postProfile!.is_following = true
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
    const res: string = await setFollow(postProfile?.username!)
    if (res.includes('unfollowed')) {
      postProfile!.is_following = false
      decreaseFollowingCount(viewedProfile.value!)
      if (unfollowPopupActive.value) {
        unfollowPopupActive.value = false
      }
    }
    isLoadingFollow.value = false
  }
}

onBeforeMount(() => {
  getPostProfile()
})
</script>

<template>
  <div
    v-if="!isLoading"
    class="flex items-center justify-between"
  >
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
          <span class="opacity-60"> • </span>
          <span
            class="mr-3 cursor-pointer opacity-60"
            :title="fullCreatedAtComp"
            >{{ createdTimeComp }}</span
          >
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
