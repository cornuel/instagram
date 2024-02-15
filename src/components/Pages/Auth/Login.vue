<script lang="ts" setup>
import UiButton from '@/components/Atom/UiButton.vue'
import UiInput from '@/components/Form/UiInput.vue'
import LogoText from '@icons/logo-text.svg'

import { ref, computed } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useProfileStore } from '@/stores'
import { useAuth } from '@/composables'
import { useProfile } from '@/composables'

const route = useRoute()
const router = useRouter()

const username = ref('')
const password = ref('')
const authError = ref<Nullable<string>>(null)
const loading = ref(false)

const isDisable = computed(() => {
  return !(username.value != '' && password.value.length >= 8)
})

const submitLoginForm = async () => {
  const { getAuthenticatedUsername } = useProfileStore()
  const { logIn } = useAuth()

  loading.value = true

  // this login sets the current username in user store
  const response = await logIn(username.value, password.value)

  // if the current username is set in user store, redirect to home
  if (getAuthenticatedUsername()) {
    await useProfile().getAuthenticatedProfile()
    authError.value = null
    if (route.path != '/') router.push('/')
    // else router.go(0)
  } else {
    authError.value = response.data.detail
  }

  loading.value = false
}
</script>

<template>
  <div
    class="w-[350px] flex flex-col mt-3 max-[450px]:mt-0 max-[450px]:w-full
      no-dark text-textColor-primary"
  >
    <div
      class="flex flex-col items-center py-5 px-10 border rounded-lg
        border-borderColor max-[450px]:px-4 max-[450px]:border-none"
    >
      <RouterLink to="/" class="w-[175px] mt-[26px] mb-10">
        <LogoText />
      </RouterLink>
      <form
        id="loginForm"
        class="w-full text-center"
        @submit.prevent="submitLoginForm"
      >
        <UiInput
          class="mb-[6px]"
          name="username"
          placeholder="Phone number, username, or email"
          v-model:propValue="username"
        />
        <UiInput
          class=""
          name="password"
          placeholder="Password"
          type="password"
          v-model:propValue="password"
        />
        <UiButton
          type="submit"
          primary
          class="mt-4 mb-4 w-full"
          :disabled="isDisable"
          :isLoading="loading"
          >Log in
        </UiButton>
        <div class="flex items-center mb-5">
          <div class="separator-small bg-borderColor"></div>
          <span
            class="px-[18px] text-[13px] font-semibold text-textColor-secondary"
            >OR</span
          >
          <div class="separator-small bg-borderColor"></div>
        </div>
        <UiButton variant="text" class-props="max-[450px]:!p-0">
          <div class="flex items-center">
            <fa
              class="mr-2"
              :icon="['fab', 'square-facebook']"
              style="color: #0d84ff; height: 18px"
            />
            <span class="text-link">Log in with Facebook</span>
          </div>
        </UiButton>
        <p v-if="authError" class="text-sm text-error my-8">
          {{ authError }}
        </p>
        <RouterLink to="/" class="text-xs text-link mt-[13px]">
          <span>Forgot password?</span>
        </RouterLink>
      </form>
    </div>
    <div
      class="p-[22px] mt-[10px] text-center border rounded-lg border-borderColor
        max-[450px]:border-none"
    >
      <span class="">Don't have an account? </span>
      <RouterLink
        to="/accounts/signup"
        class="font-semibold text-buttonColor-primary"
      >
        Sign up
      </RouterLink>
    </div>
  </div>
</template>
