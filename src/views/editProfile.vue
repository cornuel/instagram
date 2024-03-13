<script lang="ts" setup>
import HomeLogin from '@/components/Pages/Home/HomeLogin.vue'
import EditProfile from '@/components/Pages/Profile/EditProfile.vue'
import { useProfileStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { authenticatedUsername, authenticatedProfile } =
  storeToRefs(useProfileStore())
</script>

<template>
  <!-- EditProfile -->
  <EditProfile v-if="authenticatedUsername" />

  <!-- Login -->
  <HomeLogin v-else />
</template>
