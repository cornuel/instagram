<script lang="ts" setup>
import HomeLogin from '@/components/Pages/Home/HomeLogin.vue'
import HomePage from '@/components/Pages/Home/HomePage.vue'
import { useProfileStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { authenticatedProfile } = storeToRefs(
  useProfileStore()
)
</script>

<template>
  <!-- Home -->
  <HomePage v-if="authenticatedProfile" />

  <!-- Login -->
  <HomeLogin v-else />
</template>
