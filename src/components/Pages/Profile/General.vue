<script lang="ts" setup>
import MoreUserIcon from '@icons/more-user.svg'
import SettingIcon from '@icons/setting.svg'

import UiButton from '@/components/Atom/UiButton.vue'
import Avatar from '@/components/Atom/Avatar.vue'
import FollowActionsPopup from '@/components/Popup/Profile/FollowActionsPopup.vue'
import ChangeAvatarPopup from '@/components/Popup/Profile/ChangeAvatarPopup.vue'
// import Stories from '@/components/Molecules/Stories/Stories.vue'
import { useRouter } from 'vue-router'

import { ref, computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore, useResizeStore } from '@/stores'
import { useFollow, useProfile } from '@/composables'
import { formatNumberToSuffix } from '@/helpers'
import { Navigation } from 'swiper/modules'

defineProps<{
  isCurrentUser: boolean
}>()

const { viewedProfile, authenticatedProfile } = storeToRefs(useProfileStore())
const router = useRouter()
const { dimensions } = storeToRefs(useResizeStore())
const isLoadingFollow = ref(false)
const followActionsPopupActive = ref(false)
const avatarPopupActive = ref(false)

const inputAvatar = ref<Nullable<HTMLInputElement>>(null)
const isLoadingAvatar = ref(false)

const isUserProfile = computed(() => {
  return (
    viewedProfile.value !== null &&
    authenticatedProfile.value !== null &&
    viewedProfile.value.username === authenticatedProfile.value.username
  )
})

const storiesSwiperOptions = reactive({
  modules: [Navigation],
  slidesPerView: 1,
  slidesPerGroup: 1,
  spaceBetween: 0,
  allowTouchMove: true,
  navigation: {
    nextEl: '.navigation-next',
    prevEl: '.navigation-prev',
    disabledClass: 'disabled'
  },
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 3,
      slidesPerGroup: 4,
      spaceBetween: 10
    },
    400: {
      slidesPerView: 5,
      spaceBetween: 12
    },
    800: {
      slidesPerView: 6
    },
    1000: {
      slidesPerView: 7
    }
  }
})

// const mutualFollowersComp = computed(() => {
//   if (currentUser && user) {
//     const usernames: string[] = []
//     const threeFollowers = user.value!.mutualFollowers?.slice(0, 3)
//     threeFollowers?.forEach((user) => {
//       usernames.push(user.username!)
//     })

//     return usernames.join(', ')
//   }
//   return ''
// })

const isGeneralMobile = computed(() => {
  return dimensions.value.width < 736
})

const follow = async () => {
  if (authenticatedProfile) {
    const { setFollow } = useFollow()
    const { increaseFollowersCount } = useProfileStore()
    isLoadingFollow.value = true
    const res: string = await setFollow(viewedProfile.value?.username!)
    isLoadingFollow.value = false
    if (res.includes('following')) {
      increaseFollowersCount()
      viewedProfile.value!.is_following = true
    }
  }
}

const unfollow = async () => {
  if (authenticatedProfile) {
    const { setFollow } = useFollow()
    const { decreaseFollowersCount } = useProfileStore()
    isLoadingFollow.value = true
    const res: string = await setFollow(viewedProfile.value?.username!)
    isLoadingFollow.value = false
    if (res.includes('unfollowed')) {
      decreaseFollowersCount()
      viewedProfile.value!.is_following = false
    }
  }
}

const hanldeClickChangeAvatar = () => {
  if (isUserProfile.value) {
    avatarPopupActive.value = true
    if (authenticatedProfile.value!.profile_pic == '')
      inputAvatar.value?.click()
    else {
      avatarPopupActive.value = true
    }
  }
}

const getInputAvatar = async (event: Event) => {
  if (authenticatedProfile.value) {
    const file = (event.target as HTMLInputElement).files![0]
    const fileName = file.name
    console.log(file, fileName)

    const { updateProfile } = useProfile()

    avatarPopupActive.value = false
    isLoadingAvatar.value = true
    const res = await updateProfile(
      authenticatedProfile.value.username,
      authenticatedProfile.value.bio || '',
      authenticatedProfile.value.full_name || '',
      file
    )

    if (res) {
      const { setAuthenticatedProfile } = useProfileStore()
      authenticatedProfile.value.profile_pic = res.profile_pic
      setAuthenticatedProfile(authenticatedProfile.value)
      if (
        viewedProfile.value?.username === authenticatedProfile.value.username
      ) {
        viewedProfile.value!.profile_pic = res.profile_pic
      }
    }
    isLoadingAvatar.value = false
  }
}

const deleteAvatar = async () => {
  if (authenticatedProfile.value) {
    const { deleteProfilePic } = useProfile()

    avatarPopupActive.value = false
    isLoadingAvatar.value = true
    const res = await deleteProfilePic(authenticatedProfile.value.username)

    if (res) {
      const { setAuthenticatedProfile } = useProfileStore()
      authenticatedProfile.value.profile_pic = ''
      setAuthenticatedProfile(authenticatedProfile.value)
      if (
        viewedProfile.value?.username === authenticatedProfile.value.username
      ) {
        viewedProfile.value!.profile_pic = ''
      }
    }
    isLoadingAvatar.value = false
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex w-full mb-6 min-[736px]:mb-11 px-4 min-[736px]:px-0">
      <div class="flex-[0_1] min-[736px]:flex-[1_1_0%]">
        <div class="relative flex justify-center mr-[30px]">
          <div
            v-if="isLoadingAvatar"
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <fa
              class="text-white animate-spin"
              :icon="['fas', 'spinner']"
            />
          </div>
          <Avatar
            :width="isGeneralMobile ? '77' : '150'"
            :avatar-url="viewedProfile!.profile_pic"
            :class="isUserProfile ? 'cursor-pointer' : ''"
            title="Change profile picture"
            @click="hanldeClickChangeAvatar"
          />
          <ChangeAvatarPopup
            v-if="avatarPopupActive"
            @upload-avatar="
              () => {
                inputAvatar?.click()
              }
            "
            @delete-avatar="deleteAvatar"
            @close="
              () => {
                avatarPopupActive = false
              }
            "
          />
        </div>
      </div>
      <form
        class="hidden"
        method="post"
        enctype="multipart/form-data"
      >
        <input
          ref="inputAvatar"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          type="file"
          @change="getInputAvatar"
        />
      </form>
      <div class="flex flex-col flex-[2_1_0%]">
        <div
          class="flex flex-col min-[736px]:flex-row items-start min-[736px]:items-center"
        >
          <div class="flex mb-4 min-[736px]:mb-0">
            <RouterLink
              to=""
              class="text-xl mr-2"
              >{{ viewedProfile?.username }}</RouterLink
            >
            <div v-if="isGeneralMobile">
              <UiButton
                v-if="isCurrentUser"
                class=""
                variant="text"
              >
                <SettingIcon />
              </UiButton>
              <UiButton
                v-else
                variant="text"
              >
                <fa
                  class="text-textColor-primary text-lg"
                  :icon="['fas', 'ellipsis']"
                />
              </UiButton>
            </div>
          </div>
          <div class="flex flex-wrap ml-0 min-[736px]:ml-4">
            <UiButton
              v-if="isCurrentUser"
              @click="
                () => {
                  router.push({
                    name: 'EditProfile'
                  })
                }
              "
              secondary
              >Edit profile</UiButton
            >
            <template v-else>
              <UiButton
                class="mr-2"
                v-if="viewedProfile?.is_following"
                secondary
                :isDisabled="isLoadingFollow"
                :isLoading="isLoadingFollow"
                @click="
                  () => {
                    followActionsPopupActive = true
                  }
                "
              >
                <span>Follow</span>
                <fa
                  class="text-xs ml-1"
                  :icon="['fas', 'chevron-down']"
                />
              </UiButton>
              <UiButton
                class="mr-2"
                v-else
                primary
                :isDisabled="isLoadingFollow"
                :isLoading="isLoadingFollow"
                @click="follow"
                >Follow</UiButton
              >
              <UiButton secondary>
                <MoreUserIcon />
              </UiButton>
            </template>
          </div>
          <div v-if="!isGeneralMobile">
            <UiButton
              v-if="isCurrentUser"
              class=""
              variant="text"
            >
              <SettingIcon />
            </UiButton>
            <UiButton
              v-else
              variant="text"
            >
              <fa
                class="text-textColor-primary text-lg"
                :icon="['fas', 'ellipsis']"
              />
            </UiButton>
          </div>
        </div>
        <template v-if="!isGeneralMobile">
          <ul class="flex [&>*:not(:last-child)]:mr-10 my-5">
            <li class="text-base">
              <span
                class="font-semibold"
                :title="
                  authenticatedProfile?.posts_count?.toString() ||
                  viewedProfile?.posts_count?.toString()
                "
                >{{
                  formatNumberToSuffix(
                    authenticatedProfile?.username === viewedProfile?.username
                      ? authenticatedProfile?.posts_count
                      : viewedProfile?.posts_count
                  )
                }}</span
              >
              posts
            </li>
            <li class="text-base">
              <component
                :is="
                  viewedProfile?.followers_count == 0 || !authenticatedProfile
                    ? 'span'
                    : 'router-link'
                "
                :to="{ name: 'Followers' }"
              >
                <span
                  class="font-semibold"
                  :title="viewedProfile?.followers_count?.toString()"
                  >{{
                    formatNumberToSuffix(viewedProfile?.followers_count)
                  }}</span
                >
                followers
              </component>
            </li>
            <li class="text-base">
              <component
                :is="
                  viewedProfile?.following_count == 0 || !authenticatedProfile
                    ? 'span'
                    : 'router-link'
                "
                :to="{ name: 'Following' }"
              >
                <span
                  class="font-semibold"
                  :title="viewedProfile?.following_count?.toString()"
                  >{{
                    formatNumberToSuffix(viewedProfile?.following_count)
                  }}</span
                >
                following
              </component>
            </li>
          </ul>
          <div class="flex flex-col">
            <span class="font-semibold">{{ viewedProfile?.full_name }}</span>
            <span class="">{{ viewedProfile?.bio }}</span>
          </div>
          <!-- <div
            v-if="user?.mutualFollowers && mutualFollowersComp"
            class="mt-4 text-xs text-textColor-secondary"
          >
            <RouterLink :to="{ name: 'MutualFollowers' }">
              You are following {{ mutualFollowersComp }}
              <span v-if="user.mutualFollowers && user.mutualFollowers.length > 3">
                and {{ user.mutualFollowers.length - 3 }} other people</span
              >
              in common
            </RouterLink>
          </div> -->
        </template>
      </div>
    </div>

    <!-- <Stories
      class="mb-5 min-[736px]:mb-11"
      :options="storiesSwiperOptions"
      :image-size="isGeneralMobile ? '55' : '77'"
      :has-add-story="isCurrentUser"
    /> -->

    <FollowActionsPopup
      v-if="followActionsPopupActive"
      :profile="viewedProfile!"
      :onUnfollow="
        () => {
          followActionsPopupActive = false
          unfollow()
        }
      "
      :onClose="
        () => {
          followActionsPopupActive = false
        }
      "
      :onClickOutside="
        () => {
          followActionsPopupActive = false
        }
      "
    />
  </div>
</template>
