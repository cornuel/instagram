<script lang="ts" setup>
import SettingIcon from '@icons/setting.svg'
import ClockIcon from '@icons/clock.svg'
import BookmarkIcon from '@icons/bookmark.svg'
import SunIcon from '@icons/sun.svg'
import MoonIcon from '@icons/moon.svg'
import ReportIcon from '@icons/report.svg'
import LogoutPopup from '@/components/Popup/LogoutPopup.vue'

import UiSwitchButton from '@/components/Atom/UiSwitchButton.vue'

import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  useProfileStore,
  useThemeStore,
  useModalStore
} from '@/stores'

const router = useRouter()
const tabActive = ref(false)
const { darkMode } = storeToRefs(useThemeStore())
const { logoutModalShow } = storeToRefs(useModalStore())

const { setTheme } = useThemeStore()

watch(darkMode, (newTheme) => {
  setTheme(newTheme)
})

const logout = async () => {
  logoutModalShow.value = true
}
</script>

<template>
  <div
    class="absolute bottom-full parent-[.isNarrow]:bottom-0 left-0
      parent-[.isNarrow]:left-full w-[266px] max-h-[405px]
      has-[active]:max-h-[120px] bg-modal rounded-2xl
      shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-40 overflow-hidden
      transition-[max-height] duration-200"
    :class="{ active: tabActive }"
  >
    <div
      class="transition-transform duration-200 ease-ease1
        parent-[.active]:-translate-x-full"
    >
      <div class="flex flex-col p-2">
        <RouterLink
          to=""
          class="flex w-full p-4 items-center hover:bg-hover
            active:opacity-50 rounded-lg transition-colors duration-200
            cursor-pointer"
        >
          <SettingIcon />
          <span class="ml-3 leading-tight">Settings</span>
        </RouterLink>
        <RouterLink
          to=""
          class="flex w-full p-4 items-center hover:bg-hover
            active:opacity-50 rounded-lg transition-colors duration-200
            cursor-pointer"
        >
          <ClockIcon />
          <span class="ml-3 leading-tight"
            >Your Activity</span
          >
        </RouterLink>
        <RouterLink
          to=""
          class="flex w-full p-4 items-center hover:bg-hover
            active:opacity-50 rounded-lg transition-colors duration-200
            cursor-pointer"
        >
          <BookmarkIcon />
          <span class="ml-3 leading-tight">Saved</span>
        </RouterLink>
        <div
          class="flex w-full p-4 items-center hover:bg-hover
            active:opacity-50 rounded-lg transition-colors duration-200
            cursor-pointer"
          @click="
            () => {
              tabActive = true
            }
          "
        >
          <SunIcon v-if="!darkMode" />
          <MoonIcon v-else />
          <span class="ml-3 leading-tight"
            >Switch appearance</span
          >
        </div>
        <RouterLink
          to=""
          class="flex w-full p-4 items-center hover:bg-hover
            active:opacity-50 rounded-lg transition-colors duration-200
            cursor-pointer"
        >
          <ReportIcon />
          <span class="ml-3 leading-tight"
            >Report a problem</span
          >
        </RouterLink>
      </div>
      <div class="w-full h-[6px] bg-separator"></div>
      <div class="p-2">
        <div
          class="flex w-full p-4 items-center hover:bg-hover
            active:opacity-50 rounded-lg transition-colors duration-200
            cursor-pointer"
        >
          <span class="leading-tight">Switch accounts</span>
        </div>
      </div>
      <div class="w-full h-[1px] bg-separator"></div>
      <div class="p-2">
        <div
          class="flex w-full p-4 items-center hover:bg-hover
            active:opacity-50 rounded-lg transition-colors duration-200
            cursor-pointer"
          @click="logout"
        >
          <span class="leading-tight">Log out</span>
        </div>
      </div>
      <LogoutPopup v-if="logoutModalShow" />
    </div>
    <div
      class="absolute top-0 left-full parent-[.active]:left-0 w-full
        transition-[left] duration-200 ease-ease1"
    >
      <div class="p-4 flex items-center">
        <div
          class="w-5 h-5 text-[12px] text-textColor-secondary flex
            flex-center mr-2 cursor-pointer"
          @click="tabActive = false"
        >
          <fa :icon="['fas', 'chevron-left']" />
        </div>
        <span
          class="flex-grow text-base leading-tight font-semibold"
          >Switch appareance</span
        >
        <div class="">
          <SunIcon v-if="!darkMode" />
          <MoonIcon v-else />
        </div>
      </div>
      <div class="w-full h-[1px] bg-separator"></div>
      <div class="p-2">
        <div
          class="flex w-full p-4 items-center hover:bg-hover rounded-lg
            transition-colors duration-200 cursor-pointer"
        >
          <span class="leading-tight flex-grow"
            >Dark mode</span
          >
          <UiSwitchButton v-model:propValue="darkMode" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
svg {
  color: var(--primary-text-color);
  fill: var(--primary-text-color);
}
</style>
