<script lang="ts" setup>
import Avatar from '@/components/Atom/Avatar.vue'
import PostReviewItem from '@/components/Pages/Post/PostReviewItem.vue'

import { ref, computed } from 'vue'

import {
  onBeforeRouteUpdate,
  useRouter,
  useRoute
} from 'vue-router'

import { storeToRefs } from 'pinia'

import {
  useSearchStore,
  useResizeStore,
  useTagStore
} from '@/stores'

import { useSearch } from '@/composables'
import VueEternalLoading from '@/helpers/VueEternalLoading.vue'
import type { LoadAction } from '@/types/vue-eternal'

const { query, searchedPosts } = storeToRefs(
  useSearchStore()
)
const { dimensions } = storeToRefs(useResizeStore())

const { currentTag } = storeToRefs(useTagStore())

const page = ref(1)

async function load({ loaded }: LoadAction): Promise<void> {
  const { fetchPostsByTagQuery } = useSearch()
  if (searchedPosts.value.next) {
    page.value += 1
    const loadedPosts = await fetchPostsByTagQuery(
      query.value,
      page.value
    )

    searchedPosts.value.next = loadedPosts.next
    searchedPosts.value.results.push(
      ...loadedPosts.results.posts
    )
    useSearchStore().setSearchedPosts(searchedPosts.value)
    loaded(searchedPosts.value.results.length, 9)
  } else {
    loaded(0, 0)
  }
}

const isGeneralMobile = computed(() => {
  return dimensions.value.width < 736
})

// onBeforeMount(async () => {
//   await getPosts()
// }),
//   onBeforeRouteUpdate(async () => {
//     // console.log(route.path)
//     // const regex = /\/([^/]+)\/(following)/
//     // const match = regex.exec(route.path)
//     // if (!match) {
//     await getPosts()
//     // }
//   })
</script>

<template>
  <div
    class="max-w-[935px] pt-[30px] px-0 min-[736px]:px-5 mx-auto
      box-content flex flex-col"
  >
    <div
      class="flex w-full mb-6 min-[736px]:mb-11 px-4 min-[736px]:px-0"
    >
      <div class="flex-[0_1] min-[736px]:flex-[1_1_0%]">
        <div class="relative flex justify-center mr-[30px]">
          <Avatar
            :width="isGeneralMobile ? '77' : '150'"
            :avatar-url="
              searchedPosts!.results[0]?.images[0]
                ?.thumbnail
            "
            :title="currentTag.name"
          />
        </div>
      </div>
      <div class="flex flex-col flex-[2_1_0%]">
        <div
          class="flex flex-col min-[736px]:flex-row items-start
            min-[736px]:items-center"
        >
          <div
            class="text-transparent bg-clip-text bg-gradient-to-r
              from-buttonColor-primary to-buttonColor-primary-hover"
          >
            <div
              class="text-3xl min-[736px]:text-4xl font-semibold"
            >
              {{ currentTag?.name }}
            </div>
          </div>
        </div>
        <div class="flex-col">
          <div class="text-sm pb-4">
            #{{ currentTag?.slug }}
          </div>
          <div class="text-base">
            <span
              class="font-semibold"
              :title="currentTag?.post_count?.toString()"
              >{{ currentTag?.post_count }}</span
            >
            <span class=""> posts</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-[45px] min-[768px]:mt-0"></div>
    <!-- <Loading v-if="isLoading" class="mt-10" /> -->
    <div
      v-if="searchedPosts"
      class="flex flex-wrap -mx-[2px]"
    >
      <PostReviewItem
        class="w-1/3 px-[2px] mb-1"
        v-for="post in searchedPosts.results"
        :key="post.id"
        :post="post"
      />
      <VueEternalLoading :load="load"></VueEternalLoading>
    </div>
  </div>
</template>
