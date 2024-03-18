<script setup lang="ts">
import { useProfileStore } from '@/stores'
import { useProfile } from '@/composables'
import Avatar from '@/components/Atom/Avatar.vue'
import UiButton from '@/components/Atom/UiButton.vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const { authenticatedProfile } = storeToRefs(
  useProfileStore()
)

const { setAuthenticatedProfile } = useProfileStore()

const { updateProfile } = useProfile()

const bio = ref(authenticatedProfile.value.bio)
const fullName = ref(authenticatedProfile.value.full_name)

const activeFullNameCharactersTooltip = ref(false)
const activeBioCharactersTooltip = ref(false)

const bioCharacterCount = computed(() => {
  return bio.value.length
    .toLocaleString('en-US')
    .replace(',', '.')
})

const fullNameCharacterCount = computed(() => {
  return fullName.value.length
    .toLocaleString('en-US')
    .replace(',', '.')
})

const isDisable = computed(() => {
  return !(fullName.value.length >= 3)
})

const submitUpdateProfile = async () => {
  const res = await updateProfile(
    authenticatedProfile.value.username,
    bio.value,
    fullName.value
  )
  if (res) {
    authenticatedProfile.value.bio = bio.value
    authenticatedProfile.value.full_name = fullName.value
    setAuthenticatedProfile(authenticatedProfile.value)
  }
}

// watch(
//   authenticatedProfile,
//   (newProfile, oldProfile) => {
//     if (newProfile.bio.length >= 2200) {
//       newProfile.bio = newProfile.bio.slice(
//         0,
//         oldProfile.bio.length
//       )
//     }
//   },
//   { deep: true }
// )
</script>

<template>
  <div class="flex flex-col mx-12">
    <span class="font-bold text-xl my-4">
      Edit profile
    </span>
    <div>
      <div
        class="flex bg-bgColor-secondary rounded-2xl my-4"
      >
        <div>
          <Avatar
            width="60"
            class="m-4"
            :avatar-url="authenticatedProfile!.profile_pic"
          />
        </div>
        <div
          class="flex items-center justify-between w-full"
        >
          <div class="text-left">
            <div class="font-bold text-lg">
              {{ authenticatedProfile?.username }}
            </div>
            <div class="text-textColor-secondary">
              {{ authenticatedProfile?.full_name }}
            </div>
          </div>
          <UiButton type="submit" primary class="m-4"
            >Change photo
          </UiButton>
        </div>
      </div>
    </div>
    <span class="font-bold text-lg my-4"> Full Name </span>
    <div class="flex flex-col">
      <div
        class="h-[80px] outline outline-zinc-300 outline-1 rounded-2xl
          focus-within:outline-black focus-within:outline-[1.5px]"
      >
        <textarea
          class="w-full h-full px-4 py-2 text-base resize-none
            placeholder:text-placeholder"
          v-model="fullName"
          ref="captionInputRef"
          placeholder="Full Name"
        ></textarea>
        <div
          class="flex items-center justify-end px-2 -my-8 flex-shrink-0"
        >
          <div
            class="maximum-characters relative"
            :class="{
              active: activeFullNameCharactersTooltip
            }"
            v-click-outside.short="
              () => {
                activeFullNameCharactersTooltip = false
              }
            "
          >
            <span
              class="text-xs text-textColor-secondary cursor-pointer
                parent-[.maximum-characters.active]:text-textColor-primary"
              @click="
                activeFullNameCharactersTooltip =
                  !activeFullNameCharactersTooltip
              "
              >{{ fullNameCharacterCount }}/50</span
            >
            <div
              v-if="activeFullNameCharactersTooltip"
              class="maximum-characters-tolltip absolute mt-[10px] p-3 top-full
                right-0 w-[291px] text-center text-white bg-black rounded-lg
                drop-shadow-[0_0_7px_rgba(0,0,0,0.1)] z-[1]"
            >
              <span>150 characters maximum.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="font-bold text-lg my-4"> Bio </span>
    <div class="flex flex-col">
      <div
        class="h-[80px] outline outline-zinc-300 outline-1 rounded-2xl
          focus-within:outline-black focus-within:outline-[1.5px]"
      >
        <textarea
          class="w-full h-full px-4 py-2 text-base resize-none
            placeholder:text-placeholder"
          v-model="bio"
          ref="captionInputRef"
          placeholder="Bio"
        ></textarea>
        <div
          class="flex items-center justify-end px-2 -my-8 flex-shrink-0"
        >
          <div
            class="maximum-characters relative"
            :class="{ active: activeBioCharactersTooltip }"
            v-click-outside.short="
              () => {
                activeBioCharactersTooltip = false
              }
            "
          >
            <span
              class="text-xs text-textColor-secondary cursor-pointer
                parent-[.maximum-characters.active]:text-textColor-primary"
              @click="
                activeBioCharactersTooltip =
                  !activeBioCharactersTooltip
              "
              >{{ bioCharacterCount }}/150</span
            >
            <div
              v-if="activeBioCharactersTooltip"
              class="maximum-characters-tolltip absolute mt-[10px] p-3 top-full
                right-0 w-[291px] text-center text-white bg-black rounded-lg
                drop-shadow-[0_0_7px_rgba(0,0,0,0.1)] z-[1]"
            >
              <span>50 characters maximum.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <UiButton
      type="submit"
      primary
      class="my-8"
      :disabled="isDisable"
      @click="submitUpdateProfile"
      >Submit
    </UiButton>
  </div>
</template>
