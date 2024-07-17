<script lang="ts" setup>
import UserItem from '@/components/Molecules/User/UserItem.vue'
import UserItemSkeleton from '@/components/Skeleton/User/UserItemSkeleton.vue'
import VueEternalLoading from '@/helpers/VueEternalLoading.vue'
import type { LoadAction } from '@/types/vue-eternal'
import { loadProfiles } from '@/helpers/eternalLoader'

import { storeToRefs } from 'pinia'
import { usePostStore, useProfileStore } from '@/stores'
import { useLike } from '@/composables'
import { ref } from 'vue'
import type { IPaginatedProfiles } from '@/types'

const { post } = storeToRefs(usePostStore())

const { likedListModal, isLoadingLikedList, likedList } =
  storeToRefs(usePostStore())
const { authenticatedProfile } = storeToRefs(useProfileStore())

const close = () => {
  likedListModal.value = false
}

const page = ref(1)

const getMoreLikedUsers = async (page: number) => {
  const { getLikedUsers } = useLike()

  const data: IPaginatedProfiles = (await getLikedUsers(
    page,
    post!.value!.slug,
    'post'
  )) as IPaginatedProfiles
  return data
}

const loadMoreProfiles = (loadAction: LoadAction): Promise<void> => {
  return loadProfiles(
    (page: number) => getMoreLikedUsers(page),
    loadAction,
    (page.value += 1)
  )
}
</script>

<template>
  <div
    class="flex flex-col w-screen max-w-[400px] h-[calc(100vh-40px)] max-h-[400px] bg-modal rounded-xl overflow-hidden"
  >
    <div
      class="relative h-[42px] flex flex-center border-b border-separator-modal"
    >
      <span class="text-base font-semibold">Likes</span>
      <div
        class="absolute top-1/2 -translate-y-1/2 right-2 p-2 leading-none cursor-pointer"
        @click="close"
      >
        <fa
          class="text-[25px]"
          :icon="['fas', 'xmark']"
        />
      </div>
    </div>
    <div class="flex flex-col h-full overflow-y-auto">
      <div v-if="isLoadingLikedList">
        <UserItemSkeleton
          v-for="n in 20"
          :key="n"
        />
      </div>
      <UserItem
        v-for="user in likedList"
        :key="user.id"
        :profile="user"
        :authenticatedProfile="authenticatedProfile!"
      />
      <VueEternalLoading :load="loadMoreProfiles" />
    </div>
  </div>
</template>
