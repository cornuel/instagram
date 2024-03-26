<template>
  <!-- <div>Welcome</div>
  <div class="mt-10 cursor-pointer" @click="logout">Logout</div> -->
  <div></div>
</template>

<script setup lang="ts">
import { useProfileStore } from '@/stores'
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = async () => {
  const { setAuthenticatedUsername } = useProfileStore()
  setAuthenticatedUsername('')
  router.push('accounts/login')
}
</script>

<style scoped></style>
