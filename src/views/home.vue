<script lang="ts" setup>
import HomeLogin from '@/components/Pages/Home/HomeLogin.vue'
import HomePage from '@/components/Pages/Home/HomePage.vue'
import { computed, type ComputedRef } from 'vue'
import type { IProfile } from '@/types'
import { useProfileStore } from '@/stores'

const authenticatedUsername: ComputedRef<string | null> = computed(
  () => useProfileStore().getAuthenticatedUsername()
)

const authenticatedProfile: ComputedRef<IProfile | null> = computed(
  () => useProfileStore().getAuthenticatedProfile()
)

console.log('authenticatedUsername is ' + authenticatedUsername.value)

console.log('authenticatedProfile is ' + authenticatedProfile.value)
</script>

<template>
  <!-- Home -->
  <HomePage v-if="authenticatedUsername" />

  <!-- Login -->
  <HomeLogin v-else />
</template>
