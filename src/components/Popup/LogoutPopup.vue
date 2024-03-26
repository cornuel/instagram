<script lang="ts" setup>
import Modal from '@/components/Modal/Modal.vue'

import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useModalStore,
  useProfileStore,
  useAuthStore
} from '@/stores'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables'

const router = useRouter()

const unsubscribe = ref<NodeJS.Timeout>()
const { logoutModalShow } = storeToRefs(useModalStore())

const logout = () => {
  const { removeAuthenticatedProfile } = useProfileStore()

  const { removeAccessToken, removeRefreshToken } =
    useAuthStore()

  removeAuthenticatedProfile()

  removeAccessToken()
  removeRefreshToken()

  if (router.currentRoute.value.name == 'Home') router.go(0)
  else router.push('/')
}

const handleClickLogin = () => {
  clearTimeout(unsubscribe.value)
  logout()
  logoutModalShow.value = false
}

onMounted(async () => {
  new Promise(
    () =>
      (unsubscribe.value = setTimeout(() => {
        logout()
      }, 5000))
  )
  // logoutModalShow.value = false
})
</script>

<template>
  <Modal :isShow="logoutModalShow">
    <div
      class="w-screen max-w-[400px] bg-modal rounded-xl text-center
        overflow-hidden"
    >
      <div
        class="p-6 flex flex-col border-b border-separator-modal"
      >
        <span class="text-xl mb-1">Logging out</span>
        <span class="text-textColor-secondary"
          >You need to log in again</span
        >
      </div>
      <div
        class="w-full p-4 hover:bg-[#e5e5e5] text-center cursor-pointer
          select-none"
        @click="handleClickLogin"
      >
        <span class="leading-tight">Log in</span>
      </div>
    </div>
  </Modal>
</template>
