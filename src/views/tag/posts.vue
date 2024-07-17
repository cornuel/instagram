<script lang="ts" setup>
import Loading from '@/components/Utils/Loading.vue'
import PostReviewItem from '@/components/Pages/Post/PostReviewItem.vue'
import { ref, onBeforeMount, computed } from 'vue'
import { storeToRefs } from 'pinia'

import {
  useSearchStore,
  useTagStore,
  usePostStore,
  useLayoutStore
} from '@/stores'

import { useSearch, useTag } from '@/composables'
import VueEternalLoading from '@/helpers/VueEternalLoading.vue'
import type { LoadAction } from '@/types/vue-eternal'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { loadPosts } from '@/helpers/eternalLoader'

const { query, searchedPosts } = storeToRefs(useSearchStore())
const { getLayoutClass } = storeToRefs(useLayoutStore())

// const layoutClass = computed(() => getLayoutClass())

const isLoading = ref(true)
const { currentTag } = storeToRefs(useTagStore())
const { showedPosts } = storeToRefs(usePostStore())

const page = ref(1)

const getPosts = async () => {
  const { fetchPostsByTagQuery } = useSearch()
  // reset page
  page.value = 1
  isLoading.value = true
  if (currentTag.value) {
    try {
      const fetchedPosts = await fetchPostsByTagQuery(page.value, query.value)
      const { setShowedPosts } = usePostStore()

      searchedPosts.value = fetchedPosts
      setShowedPosts(fetchedPosts)
      isLoading.value = false
    } catch {
      const router = useRouter()
      router.push({ name: 'home' })
    }
  }
  isLoading.value = false
}

const loadMorePosts = (loadAction: LoadAction): Promise<void> => {
  const { fetchPostsByTagQuery } = useSearch()
  return loadPosts(
    (page: number, query?: string) =>
      fetchPostsByTagQuery(page, query as string),
    loadAction,
    (page.value += 1),
    query.value
  )
}

onBeforeMount(async () => {
  await getPosts()
}),
  onBeforeRouteUpdate(async (to, from) => {
    //reuse routerguard on tag param change
    if (to.params.tagname === from.params.tagname) return
    const { getTag } = useTag()
    const { fetchPostsByTagQuery } = useSearch()

    page.value = 1
    isLoading.value = true

    getTag(to.params.tagname as string).then(async (tag) => {
      if (tag) {
        const { setQuery, setSearchedPosts } = useSearchStore()
        const { setCurrentTag } = useTagStore()
        const { setShowedPosts } = usePostStore()

        setQuery(tag.name)
        setCurrentTag(tag)

        const res = await fetchPostsByTagQuery(1, tag.name)

        if (res) {
          setSearchedPosts(res)
          setShowedPosts(res)

          document.title = `#${tag.name} on Instagram | Hashtags`
          isLoading.value = false
        }
      }
    })
  })
</script>

<template>
  <div>
    <Transition
      :duration="{ enter: 300, leave: 200 }"
      name="postsTransition"
    >
      <Loading
        v-if="isLoading"
        class="absolute left-1/2 mt-10"
      />
      <template v-else>
        <div v-if="showedPosts">
          <div class="flex flex-wrap -mx-[2px]">
            <TransitionGroup name="list">
              <PostReviewItem
                :class="getLayoutClass"
                class="innerPostsTransition px-[2px] mb-1 overflow-y-hidden"
                v-for="post in showedPosts.results"
                :key="post.id"
                :post="post"
              />
            </TransitionGroup>
            <div class="flex justify-center">
              <VueEternalLoading :load="loadMorePosts" />
            </div>
          </div>
        </div>
      </template>
    </Transition>
  </div>
</template>
