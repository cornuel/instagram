<script lang="ts" setup>
import EllipsisIcon from '@icons/ellipsis.svg'
import LikeIcon from '@icons/heart.svg'
import LikeActiveIcon from '@icons/heart-active.svg'
import Avatar from '@/components/Atom/Avatar.vue'
import ActionsPopup from '@/components/Popup/ActionsPopup.vue'

import { ref, computed, onBeforeMount, onMounted } from 'vue'

import { useComment, useLike, useProfile } from '@/composables'

import { storeToRefs } from 'pinia'
import { useCommentStore, usePostStore, useProfileStore } from '@/stores'

import { dateDistanceToNow, convertToFullDate, convertTagUser } from '@/helpers'

import type { IAction, IPaginatedProfiles, IProfile } from '@/types'

const props = withDefaults(
  defineProps<{
    id?: number | string
    parent?: number
    commentId?: string
    profile: string
    body: string
    like_count?: number
    is_liked?: boolean
    post?: string | number
    replies_count?: number
    created: any
    updated?: any
    url?: string
    isCaption?: boolean
  }>(),
  {
    isCaption: false
  }
)

const { authenticatedProfile } = storeToRefs(useProfileStore())

const { commentProfiles } = storeToRefs(useCommentStore())

const user = ref<Nullable<IProfile>>(null)
const isLike = ref(false)
const isLoadingLike = ref(false)
const loading = ref(true)
const likeCount = ref(props.like_count)
const commentActionsPopup = ref(false)

const commentActionsComp = computed(() => {
  if (props.profile == authenticatedProfile.value?.username)
    return [
      {
        title: 'Report',
        classes: 'font-bold text-error'
      },
      {
        title: 'Remove',
        classes: 'font-bold text-error',
        action: () => deleteItem()
      },
      {
        title: 'Cancel',
        action: () => {
          commentActionsPopup.value = false
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
        title: 'Cancel',
        action: () => {
          commentActionsPopup.value = false
        }
      }
    ]
})
const disabledLikeButtonComp = computed(() => {
  return isLoadingLike.value ? 'pointer-events-none' : 'pointer-events-auto'
})
const commentComp = computed(() => convertTagUser(props.body!))
const createdTimeComp = computed(() =>
  dateDistanceToNow(props.created, false, false)
)
const fullCreatedAtComp = computed(() =>
  convertToFullDate(props.created).toUpperCase()
)

const handleReply = () => {
  const { setReply } = useCommentStore()
  setReply(props.id! as number, user.value?.username!)
}

const handleLike = async () => {
  const { likeComment } = useLike()
  isLoadingLike.value = true
  isLike.value = !isLike.value

  try {
    // console.log(isLike.value)
    const response = await likeComment(Number(props.id!), !isLike.value)
    console.log(response.message)
  } catch (error) {
    isLike.value = !isLike.value
  }

  if (likeCount.value) {
    isLike.value ? (likeCount.value += 1) : (likeCount.value -= 1)
  }

  isLoadingLike.value = false
}

const deleteItem = async () => {
  const { deleteCommentPost } = useComment()
  await deleteCommentPost(Number(props.id!))
}

const handleClickLikeCount = async () => {
  const { setLikedListModal, setIsLoadingLikedList, setLikedList } =
    usePostStore()
  const { getLikedUsers } = useLike()

  setLikedListModal(true)
  setIsLoadingLikedList(true)
  const likedUsers = (await getLikedUsers(
    props.id as number,
    'comment'
  )) as IPaginatedProfiles
  setLikedList(likedUsers.results)
  setIsLoadingLikedList(false)
}

onBeforeMount(async () => {
  if (!commentProfiles.value[props.profile]) {
    const { getProfile } = useProfile()
    const profile = await getProfile(props.profile)
    if (profile) {
      commentProfiles.value[props.profile] = profile
      user.value = profile
    }
  } else {
    user.value = commentProfiles.value[props.profile]
  }
  loading.value = false
})

onMounted(async () => {
  if (props) {
    isLike.value = props.is_liked
  }
})
</script>

<template>
  <div
    v-if="body && !loading"
    class="flex group/comment mb-4 mt-2"
  >
    <div class="">
      <Avatar
        width="32"
        :avatar-url="user?.profile_pic"
      />
    </div>
    <div class="flex flex-grow flex-col ml-3 mt-[2px]">
      <div class="">
        <RouterLink
          v-if="user"
          :to="{
            name: 'Profile',
            params: { username: user.username }
          }"
        >
          <span class="font-semibold mr-1">{{ user.username }}</span>
        </RouterLink>
        <div class="inline-flex items-center">
          <span
            class="leading-tight"
            v-html="commentComp"
          ></span>
        </div>
      </div>
      <div
        class="flex flex-wrap items-center mt-1 text-xs text-textColor-secondary"
      >
        <span
          class="mr-3 cursor-pointer"
          :title="fullCreatedAtComp"
          >{{ createdTimeComp }}</span
        >
        <template v-if="!isCaption">
          <span
            v-if="likeCount && likeCount > 0"
            class="font-semibold mr-3 cursor-pointer"
            @click="handleClickLikeCount"
            >{{ likeCount }} likes</span
          >
          <span
            class="font-semibold mr-5 cursor-pointer"
            @click="handleReply"
            >Reply</span
          >
          <div
            class="relative w-4 h-4 invisible group-hover/comment:visible cursor-pointer"
          >
            <EllipsisIcon
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-textColor-secondary fill-textColor-secondary"
              @click="
                () => {
                  commentActionsPopup = true
                }
              "
            />
          </div>
        </template>
      </div>
    </div>
    <div
      v-if="!isCaption && authenticatedProfile"
      class="mt-3 ml-1 cursor-pointer"
    >
      <LikeIcon
        v-if="!isLike"
        @click="handleLike"
        class="w-3 hover:opacity-60 animate-[0.45s_like-button-animation_ease-in-out] text-textColor-secondary fill-textColor-secondary"
        :class="disabledLikeButtonComp"
      />
      <LikeActiveIcon
        v-else
        @click="handleLike"
        class="w-3 fill-error animate-[0.45s_like-button-animation_ease-in-out]"
        :class="disabledLikeButtonComp"
      />
    </div>
  </div>
  <ActionsPopup
    v-if="commentActionsPopup"
    :actions="commentActionsComp"
    :on-click-outside="
      () => {
        commentActionsPopup = false
      }
    "
  />
</template>
