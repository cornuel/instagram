<script lang="ts" setup>
import Loading from '@/components/Utils/Loading.vue'
import PostReviewItem from '@/components/Pages/Post/PostReviewItem.vue'
import { ref, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

import { useSearchStore, useTagStore, usePostStore } from '@/stores'

import { useSearch, useTag } from '@/composables'
import VueEternalLoading from '@/helpers/VueEternalLoading.vue'
import type { LoadAction } from '@/types/vue-eternal'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { load } from '@/helpers/eternalLoader'

const { query, searchedPosts } = storeToRefs(useSearchStore())

const isLoading = ref(true)
const { currentTag } = storeToRefs(useTagStore())
const { isInitial, showedPosts } = storeToRefs(usePostStore())

const page = ref(1)

isInitial.value = true

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
  return load(
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
    <Loading
      v-if="isLoading"
      class="mt-10"
    />
    <template v-else>
      <div
        v-if="showedPosts"
        class="flex flex-wrap -mx-[2px]"
      >
        <PostReviewItem
          class="w-1/3 px-[2px] mb-1"
          v-for="post in showedPosts.results"
          :key="post.id"
          :post="post"
        />
        <VueEternalLoading :load="loadMorePosts"></VueEternalLoading>
      </div>
    </template>
  </div>
</template>
