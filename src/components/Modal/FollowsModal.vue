<script lang="ts" setup>
import Modal from '@/components/Modal/Modal.vue'
import UiButton from '@/components/Atom/UiButton.vue'
import UserItem from '@/components/Molecules/User/UserItem.vue'
import UserItemSkeleton from '@/components/Skeleton/User/UserItemSkeleton.vue'

import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '@/stores'
import { useFollow } from '@/composables'
import type { IPaginatedProfiles } from '@/types'

const router = useRouter()
const route = useRoute()

const isLoadingFollowItems = ref(true)
const follows = ref<IPaginatedProfiles>()
const { viewedProfile, authenticatedProfile } = storeToRefs(
  useProfileStore()
)

const isMutualFollowersPage = computed(() => {
  return route.path.includes('mutualOnly') ? true : false
})

const page = ref(1)

const getFollowList = async () => {
  isLoadingFollowItems.value = true
  const { getFollows } = useFollow()

  follows.value = (await getFollows(
    viewedProfile.value!.username,
    'following',
    page.value
  )) as IPaginatedProfiles

  isLoadingFollowItems.value = false
}

watch(route, async () => {
  await getFollowList()
})

onMounted(async () => {
  await getFollowList()
})
</script>

<template>
  <Modal
    isShow
    @click-outside="router.push({ name: 'Profile' })"
  >
    <div
      class="flex flex-col w-screen max-w-[400px] h-[calc(100vh-40px)]
        max-h-[400px] bg-modal rounded-xl overflow-hidden"
    >
      <div
        class="relative h-[42px] flex flex-center border-b
          border-separator-modal"
      >
        <span class="text-base font-semibold"
          >Followers</span
        >
        <div
          class="absolute top-1/2 -translate-y-1/2 right-2 p-2 leading-none
            cursor-pointer"
          @click="router.push({ name: 'Profile' })"
        >
          <fa
            class="text-[25px]"
            :icon="['fas', 'xmark']"
          />
        </div>
      </div>
      <div class="flex flex-col h-full overflow-y-auto">
        <template v-if="isLoadingFollowItems">
          <UserItemSkeleton v-for="n in 20" :key="n" />
        </template>
        <UserItem
          v-for="profile in follows?.results"
          :key="profile.id"
          :viewedProfile="profile"
          :authenticatedProfile="authenticatedProfile!"
        />
        <UiButton variant="text">
          <RouterLink
            v-if="isMutualFollowersPage"
            :to="{ name: 'MutualFirstFollowers' }"
            >See more</RouterLink
          >
        </UiButton>
      </div>
    </div>
  </Modal>
</template>
