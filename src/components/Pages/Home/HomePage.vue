<script setup lang="ts">
import {
  usePostStore,
  useProfileStore,
  useFeedStore,
  useResizeStore,
  useLayoutStore
} from '@/stores'
import { useFeed } from '@/composables'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import VueEternalLoading from '@/helpers/VueEternalLoading.vue'
import type { LoadAction } from '@/types/vue-eternal'
import { load } from '@/helpers/eternalLoader'
import FeedPost from '../FeedPost/FeedPost.vue'
import Modal from '@/components/Modal/Modal.vue'
import UsersWhoLikedModal from '@/components/Modal/UsersWhoLikedModal.vue'
import LayoutSelector from '@/components/Molecules/Layout/LayoutSelector.vue'
import { onBeforeMount, onMounted, onUpdated, ref, watch } from 'vue'
import type { IPost } from '@/types'

const router = useRouter()

const { screen } = storeToRefs(useResizeStore())
const { feedLayout } = storeToRefs(useLayoutStore())
const { showedPosts, likedListModal } = storeToRefs(usePostStore())
const { addProfiletoFeedProfiles, feedProfiles } = useProfileStore()
const page = ref(1)
const isLoading = ref(true)

const close = () => {
  likedListModal.value = false
}

const loadMorePosts = (loadAction: LoadAction): Promise<void> => {
  const { setFeed } = useFeedStore()
  return load((page: number) => setFeed(page), loadAction, (page.value += 1))
}

onBeforeMount(async () => {
  const { setFeed } = useFeedStore()
  showedPosts.value = await setFeed()
  isLoading.value = false
})

// onUpdated(async () => {
//   if (showedPosts.value?.results) {
//     for (const post of showedPosts.value.results) {
//       await addProfiletoFeedProfiles(post.profile)
//     }
//   }
// })

// const { feed } = storeToRefs(useFeedStore())
</script>

<template>
  <div class="w-full">
    <div
      v-if="screen === 'tablet' || screen === 'desktop'"
      class="absolute bottom-0 right-5 z-20 bg-bgColor-primary rounded-t-lg outline outline-1 outline-borderColor"
    >
      <LayoutSelector type="feed" />
    </div>
    <!-- <div
    class="max-w-[500px] pt-[30px] px-0 min-[736px]:px-5 mx-auto box-content flex flex-col"
  >
    <FeedPost
      v-for="post in showedPosts?.results"
      :key="post.id"
      :id="post.id"
      :post="post"
    />
    <VueEternalLoading :load="loadMorePosts" />
  </div> -->
    <!-- 2 posts display -->
    <div
      v-if="!isLoading"
      class="px-0 min-[736px]:px-5 mx-auto box-content flex"
      :class="
        feedLayout === 'double' && screen !== 'mobile'
          ? 'max-w-7xl flex-wrap'
          : 'max-w-[500px] flex-col'
      "
    >
      <TransitionGroup name="list">
        <FeedPost
          v-for="post in showedPosts?.results"
          :key="post.id"
          :id="post.id"
          :post="post"
          :class="
            feedLayout === 'double' && screen !== 'mobile' ? 'w-1/2 px-2' : ''
          "
        />
      </TransitionGroup>
      <VueEternalLoading :load="loadMorePosts" />
      <Teleport to="#modal">
        <Modal
          :isShow="likedListModal"
          @click-outside="close"
        >
          <UsersWhoLikedModal />
        </Modal>
      </Teleport>
    </div>
  </div>
</template>
