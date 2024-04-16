<script lang="ts" setup>
import Modal from '@/components/Modal/Modal.vue'
import UserItem from '@/components/Molecules/User/UserItem.vue'
import UserItemSkeleton from '@/components/Skeleton/User/UserItemSkeleton.vue'

import { storeToRefs } from 'pinia'
import { usePostStore, useProfileStore } from '@/stores'

const { likedListModal, isLoadingLikedList, likedList } =
  storeToRefs(usePostStore())
const { authenticatedProfile } = storeToRefs(useProfileStore())

const close = () => {
  likedListModal.value = false
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
        :viewedProfile="user"
        :authenticatedProfile="authenticatedProfile!"
      />
    </div>
  </div>
</template>
