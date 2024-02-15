<script lang="ts" setup>
import UiButton from '@/components/Atom/UiButton.vue'
import UiInput from '@/components/Form/UiInput.vue'
import LogoText from '@icons/logo-text.svg'

import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
// import { useAuth, useCheck, useUser } from '@/composables'

const router = useRouter()

interface AuthError {
  emailOrPhoneError: string | null
  usernameError: string | null
  signupError: string | null
}

const username = ref('')
const password = ref('')
const fullname = ref('')
const emailOrPhone = ref('')
const authError = ref<AuthError>({
  emailOrPhoneError: null,
  usernameError: null,
  signupError: null
})
const isShowError = ref(false)
const checkContact = ref<Nullable<boolean>>(null)
const checkUsername = ref<Nullable<boolean>>(null)
const checkPassword = ref<Nullable<boolean>>(null)
const loading = ref(false)

const isDisable = computed(() => {
  return !(
    username.value != '' &&
    emailOrPhone.value != '' &&
    password.value.length >= 8
  )
})

const submitSignupForm = async () => {
  // const { authError: authErr, signUp } = useAuth()
  // loading.value = true
  // if (authError.value.emailOrPhoneError || authError.value.usernameError) {
  //   isShowError.value = true
  // } else {
  //   await signUp(emailOrPhone.value, password.value, fullname.value, username.value)
  //   if (authError.value) {
  //     authError.value.signupError = authErr.value
  //     isShowError.value = true
  //   } else {
  //     isShowError.value = false
  //     router.push('/')
  //   }
  // }
  // loading.value = false
}

const handleCheckContact = async () => {
  // const { getUserWithQuery } = useUser()
  // const { checkError, checkPhoneNumber, checkEmail } = useCheck()
  // let user = null
  // isShowError.value = false
  // checkContact.value = null
  // const regex = /^\+?\d+$/
  // const isPhoneNumber = regex.test(emailOrPhone.value)
  // if (isPhoneNumber) {
  //   const checkValue = await checkPhoneNumber(emailOrPhone.value)
  //   checkContact.value = checkValue
  // } else {
  //   const checkValue = await checkEmail(emailOrPhone.value)
  //   checkContact.value = checkValue
  // }
  // if (checkContact.value) {
  //   user = await getUserWithQuery('email', '==', emailOrPhone.value)
  //   if (user) {
  //     authError.value.emailOrPhoneError = 'Một tài khoản khác đang dùng chung email.'
  //     checkContact.value = false
  //   }
  // } else {
  //   authError.value.emailOrPhoneError = checkError.value
  // }
}

const handleCheckUsername = async () => {
  // const { getUserWithQuery } = useUser()
  // isShowError.value = false
  // const user = await getUserWithQuery('username', '==', username.value)
  // if (user == null) {
  //   checkUsername.value = true
  //   authError.value.usernameError = null
  // } else {
  //   checkUsername.value = false
  //   authError.value.usernameError = 'Tên người dùng này đã được sử dụng. Vui lòng thử tên khác.'
  // }
}

const handleCheckPassword = () => {
  isShowError.value = false
  checkPassword.value = password.value.length >= 8 ? true : false
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
          v-model:propValue="emailOrPhone"
          :checkValue="checkContact"
          @change="handleCheckContact"
        />
        <UiInput
          class="mb-[6px]"
          name="fullname"
          placeholder="Full Name"
          v-model:propValue="fullname"
          :checkValue="fullname"
          @change="isShowError = false"
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
        <p v-if="isShowError" class="text-sm text-error mt-8 mb-4">
          {{
            authError.emailOrPhoneError ||
            authError.usernameError ||
            authError.signupError
          }}
        </p>
      </form>
    </div>
    <div
      class="p-[25px] my-[10px] text-center border rounded-lg border-borderColor
        max-[450px]:border-none"
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
