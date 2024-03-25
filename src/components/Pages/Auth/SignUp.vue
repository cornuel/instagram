<script lang="ts" setup>
import UiButton from '@/components/Atom/UiButton.vue'
import UiInput from '@/components/Form/UiInput.vue'
import LogoText from '@icons/logo-text.svg'

import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables'

const router = useRouter()

interface AuthError {
  emailError: string | null
  usernameError: string | null
  passwordError: string | null
  signupError: string | null
}

const username = ref('')
const password = ref('')
const email = ref('')
const authError = ref<AuthError>({
  emailError: null,
  usernameError: null,
  passwordError: null,
  signupError: null
})
const isShowError = ref(false)
const checkEmail = ref<Nullable<boolean>>(null)
const checkUsername = ref<Nullable<boolean>>(null)
const checkPassword = ref<Nullable<boolean>>(null)
const loading = ref(false)

const isDisable = computed(() => {
  return (
    authError.value.emailError ||
    authError.value.usernameError ||
    authError.value.passwordError ||
    authError.value.signupError ||
    !email.value ||
    !username.value ||
    !password.value
  )
})

const submitSignupForm = async () => {
  const { signUp } = useAuth()
  loading.value = true
  if (
    authError.value.emailError ||
    authError.value.usernameError
  ) {
    isShowError.value = true
  } else {
    try {
      await signUp(
        username.value,
        email.value,
        password.value
      )

      isShowError.value = false
      router.push('/')
    } catch (err) {
      if (err instanceof Error) {
        authError.value.signupError = err.message
      } else {
        authError.value.signupError =
          'An unexpected error occurred'
      }
      isShowError.value = true
    }
    loading.value = false
  }
}

const handleCheckEmail = async () => {
  authError.value.signupError = null
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  isShowError.value = !regex.test(email.value)
  checkEmail.value = regex.test(email.value)
  checkEmail.value
    ? (authError.value.emailError = null)
    : (authError.value.emailError = 'Email is not valid.')
}

const handleCheckUsername = async () => {
  authError.value.signupError = null
  if (username.value.length >= 3) {
    isShowError.value = false
    checkUsername.value = true
    authError.value.usernameError = null
  } else {
    isShowError.value = true
    checkUsername.value = false
    authError.value.usernameError =
      'Username should at least be 3 characters long.'
  }
}

const handleCheckPassword = async () => {
  authError.value.signupError = null
  const regexUpperCase = new RegExp('[A-Z]')
  const regexLowerCase = new RegExp('[a-z]')
  const regexNumber = new RegExp('\\d')
  const regexSpecialChar = new RegExp('\\W')

  isShowError.value = false
  checkPassword.value = true

  if (!regexUpperCase.test(password.value)) {
    isShowError.value = true
    checkPassword.value = false
    authError.value.passwordError =
      'Password must contain at least one uppercase letter.'
  }

  if (!regexLowerCase.test(password.value)) {
    isShowError.value = true
    checkPassword.value = false
    authError.value.passwordError =
      'Password must contain at least one lowercase letter.'
  }

  if (!regexNumber.test(password.value)) {
    isShowError.value = true
    checkPassword.value = false
    authError.value.passwordError =
      'Password must contain at least one number.'
  }

  if (!regexSpecialChar.test(password.value)) {
    isShowError.value = true
    checkPassword.value = false
    authError.value.passwordError =
      'Password must contain at least one special character.'
  }

  if (password.value.length < 8) {
    isShowError.value = true
    checkPassword.value = false
    authError.value.passwordError =
      'Password must have at least 8 characters.'
  }
}
</script>

<template>
  <div
    class="w-[350px] flex flex-col mt-3 max-[450px]:mt-0
      max-[450px]:w-full no-dark text-textColor-primary"
  >
    <div
      class="flex flex-col items-center py-5 px-10 border rounded-lg
        border-borderColor max-[450px]:px-4 max-[450px]:border-none"
    >
      <RouterLink to="/" class="w-[175px] mt-[26px] mb-4">
        <LogoText />
      </RouterLink>
      <h2
        class="text-[17px] leading-5 font-semibold text-center
          text-textColor-secondary mb-[18px]"
      >
        Sign up to see photos and videos from your friends.
      </h2>
      <form
        id="signupForm"
        class="w-full text-center mb-[18px]"
        @submit.prevent="submitSignupForm"
      >
        <UiButton
          variant="contained"
          primary
          class-props="w-full mb-4"
        >
          <div class="flex items-center justify-center">
            <fa
              class="mr-2"
              :icon="['fab', 'square-facebook']"
              style="color: #ffffff; height: 18px"
            />
            <span class="text-link text-white"
              >Log in with Facebook</span
            >
          </div>
        </UiButton>
        <div class="flex items-center mb-5">
          <div class="separator-small bg-borderColor"></div>
          <span
            class="px-[18px] text-[13px] font-semibold text-textColor-secondary"
            >OR</span
          >
          <div class="separator-small bg-borderColor"></div>
        </div>
        <UiInput
          class="mb-[6px]"
          name="email"
          placeholder="Email"
          v-model:propValue="email"
          :checkValue="checkEmail"
          @change="handleCheckEmail"
        />
        <UiInput
          class="mb-[6px]"
          name="username"
          placeholder="Username"
          v-model:propValue="username"
          :checkValue="checkUsername"
          @change="handleCheckUsername"
        />
        <UiInput
          name="password"
          placeholder="Password"
          type="password"
          v-model:propValue="password"
          :checkValue="checkPassword"
          @change="handleCheckPassword"
        />
        <UiButton
          type="submit"
          class="w-full mt-8"
          primary
          :disabled="isDisable"
          :isLoading="loading"
          >Next</UiButton
        >
        <p
          v-if="isShowError"
          class="text-sm text-error mt-8 mb-4"
        >
          {{
            authError.emailError ||
            authError.usernameError ||
            authError.passwordError ||
            authError.signupError
          }}
        </p>
      </form>
    </div>
    <div
      class="p-[25px] my-[10px] text-center border rounded-lg
        border-borderColor max-[450px]:border-none"
    >
      <span>Have an account? </span>
      <RouterLink
        to="/accounts/login"
        class="font-semibold text-buttonColor-primary"
        >Log in</RouterLink
      >
    </div>
  </div>
</template>
