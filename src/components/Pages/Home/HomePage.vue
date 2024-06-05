<script setup lang="ts">
import { useFeedStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import FeedPost from '../Post/FeedPost.vue'

const router = useRouter()

const { feed } = storeToRefs(useFeedStore())
</script>

<template>
  <div
    class="max-w-[935px] pt-[30px] px-0 min-[736px]:px-5 mx-auto box-content flex flex-col"
  >
    <div>Yo</div>
  </div>
  <!-- <FeedPost
    v-for="post in feed?.results"
    :key="post.id"
    :post="post"
  /> -->
</template>
