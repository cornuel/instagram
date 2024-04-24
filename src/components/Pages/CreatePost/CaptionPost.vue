<script lang="ts" setup>
import EmojiIcon from '@icons/emoji.svg'
import HashtagIcon from '@icons/hashtag.svg'
import CrossMarkIcon from '@icons/cross.svg'

import UiButton from '@/components/Atom/UiButton.vue'
import Avatar from '@/components/Atom/Avatar.vue'
import EmojiPicker from '@/components/Molecules/Emoji/EmojiPicker.vue'

import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useProfileStore, useCreatePostStore, useResizeStore } from '@/stores'

const { isDesktop } = storeToRefs(useResizeStore())
const { authenticatedProfile } = storeToRefs(useProfileStore())
const { name, caption, tags } = storeToRefs(useCreatePostStore())
const captionInputRef = ref<Nullable<HTMLTextAreaElement>>(null)
const activeEmojiTooltip = ref(false)
const activeNameCharactersTooltip = ref(false)
const activeCaptionCharactersTooltip = ref(false)

const currentTag = ref('')

const validateTag = (tag: string): boolean => {
  const regex = /^[a-zA-Z0-9-]*$/

  return (
    tag.trim().length > 2 &&
    tag.trim().length <= 20 &&
    regex.test(tag) &&
    !tags.value.some((t) => t.toLowerCase() === tag.toLowerCase())
  )
}

const addTag = () => {
  if (validateTag(currentTag.value)) {
    tags.value.push(currentTag.value.trim())
    currentTag.value = ''
  } else {
    currentTag.value = ''
  }
}

const addTagOnEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    addTag()
    event.preventDefault()
  }
}

const removeTag = (index: number) => {
  tags.value.splice(index, 1)
}

const nameCharacterCount = computed(() => {
  return name.value.length.toLocaleString('en-US').replace(',', '.')
})
const captionCharacterCount = computed(() => {
  return caption.value.length.toLocaleString('en-US').replace(',', '.')
})

const handleClickEmoji = (emoji: string) => {
  if (captionInputRef.value) {
    captionInputRef.value.setRangeText(
      emoji,
      captionInputRef.value.selectionStart!,
      captionInputRef.value.selectionEnd!,
      'end'
    )
    caption.value = captionInputRef.value.value
    captionInputRef.value.focus()
  }
}

watch(caption, (newCaption, oldCaption) => {
  if (newCaption.length >= 2200) {
    caption.value = newCaption.slice(0, oldCaption.length)
  }
})

watch(name, (newName, oldName) => {
  if (newName.length >= 36) {
    name.value = newName.slice(0, oldName.length)
  }
})
</script>

<template>
  <div
    :class="isDesktop ? 'w-[400px] h-[400px]' : 'w-full h-fit max-h-[400px]'"
    class="overflow-y-scroll"
  >
    <div class="flex flex-col">
      <div class="flex items-center my-3 ml-3">
        <Avatar
          width="28"
          :avatar-url="authenticatedProfile!.profile_pic"
          border-color="border-transparent"
        />
        <div class="ml-2 font-semibold">
          {{ authenticatedProfile!.username }}
        </div>
      </div>
      <div class="flex flex-col">
        <div class="h-[50px] py-0 border-t border-separator-modal">
          <textarea
            class="w-full h-full px-4 text-base resize-none placeholder:text-placeholder"
            v-model="name"
            ref="nameInputRef"
            placeholder="Write a title..."
          ></textarea>
        </div>
        <div class="flex items-center justify-end px-2 flex-shrink-0">
          <div
            class="maximum-characters relative mr-2"
            :class="{ active: activeNameCharactersTooltip }"
            v-click-outside.short="
              () => {
                activeNameCharactersTooltip = false
              }
            "
          >
            <span
              class="text-xs text-textColor-secondary cursor-pointer parent-[.maximum-characters.active]:text-textColor-primary"
              @click="
                activeNameCharactersTooltip = !activeNameCharactersTooltip
              "
              >{{ nameCharacterCount }}/36</span
            >
            <div
              v-if="activeNameCharactersTooltip"
              class="maximum-characters-tolltip-title absolute mt-[10px] p-3 top-full right-0 w-[291px] text-center text-white bg-black rounded-lg drop-shadow-[0_0_7px_rgba(0,0,0,0.1)] z-[1]"
            >
              <span>36 characters maximum.</span>
            </div>
          </div>
        </div>
        <div
          class="h-[50px] flex items-center justify-between py-0 border-t border-separator-modal"
        >
          <textarea
            class="w-full h-full px-4 text-base resize-none placeholder:text-placeholder"
            v-model="currentTag"
            ref="nameInputRef"
            @keydown.enter="addTagOnEnter"
            placeholder="Enter your tags..."
          ></textarea>
          <UiButton
            type="submit"
            primary
            class=""
            size="small"
            @click="addTag"
            >+
          </UiButton>
          <div class="ml-2">
            <HashtagIcon
              v-if="true"
              class="text-textColor-primary fill-textColor-primary mr-2"
            />
            <fa
              v-else
              :icon="['far', 'circle-xmark']"
            />
          </div>
        </div>
        <div
          class="flex py-1"
          :style="{ flexWrap: 'wrap' }"
          v-if="tags.length > 0"
        >
          <div
            v-for="(tag, index) in tags"
            :key="index"
            class="flex items-center px-1.5 pb-0.5 mx-1 mb-1 border border-borderColor transition ease-in-out delay-80 duration-300 bg-bgColor-primary hover:border-buttonColor-primary text-buttonColor-primary rounded-full"
          >
            <span>{{ tag }}</span>
            <CrossMarkIcon
              class="transition ease-in-out delay-80 duration-300 hover:cursor-pointer hover:text-red-500 animate-[0.45s_like-button-animation_ease-in-out] text-textColor-primary fill-textColor-primary mx-0.5"
              @click="removeTag(index)"
            />
          </div>
        </div>
        <div
          :class="isDesktop ? 'h-[180px]' : 'h-[180px]'"
          class="border-t border-separator-modal"
        >
          <textarea
            class="w-full h-full px-4 text-base resize-none placeholder:text-placeholder"
            v-model="caption"
            ref="captionInputRef"
            placeholder="Write a caption..."
          ></textarea>
        </div>
        <div class="flex items-center justify-between px-2 flex-shrink-0">
          <div
            class="relative"
            v-click-outside="
              () => {
                activeEmojiTooltip = false
              }
            "
          >
            <div
              class="p-2 cursor-pointer"
              @click="activeEmojiTooltip = !activeEmojiTooltip"
            >
              <EmojiIcon
                width="20"
                height="20"
                class="text-textColor-secondary fill-textColor-secondary align-middle"
              />
            </div>
            <EmojiPicker
              v-if="activeEmojiTooltip"
              class="emoji-picker absolute bottom-1/2 mb-6 min-[380px]:w-[300px]"
              @clicked="handleClickEmoji"
            />
          </div>
          <div
            class="maximum-characters relative mr-2"
            :class="{
              active: activeCaptionCharactersTooltip
            }"
            v-click-outside.short="
              () => {
                activeCaptionCharactersTooltip = false
              }
            "
          >
            <span
              class="text-xs text-textColor-secondary cursor-pointer parent-[.maximum-characters.active]:text-textColor-primary"
              @click="
                activeCaptionCharactersTooltip = !activeCaptionCharactersTooltip
              "
              >{{ captionCharacterCount }}/2.200</span
            >
            <div
              v-if="activeCaptionCharactersTooltip"
              class="maximum-characters-tolltip-caption absolute mb-10 p-3 bottom-0 right-0 w-[291px] text-center text-white bg-black rounded-lg drop-shadow-[0_0_7px_rgba(0,0,0,0.1)] z-[1]"
            >
              <span>2.200 characters maximum.</span>
            </div>
          </div>
        </div>
      </div>
      <!-- <div
      class="flex items-center justify-between relative w-full px-4
        text-base border-t border-separator-modal"
    >
      <input
        type="text"
        class="flex-grow text-base leading-[30px] py-[7px]"
        placeholder="Add location"
      />
      <div class="ml-2">
        <LocationIcon
          v-if="true"
          class="text-textColor-primary fill-textColor-primary"
        />
        <fa v-else :icon="['far', 'circle-xmark']" />
      </div>
    </div>
    <div
      class="flex flex-col w-full px-4 text-base border-t
        border-separator-modal"
    >
      <div
        class="flex items-center justify-between w-full cursor-pointer"
        @click="activeAccessibility = !activeAccessibility"
      >
        <span class="py-3 leading-[20px]"
          >Accessibility</span
        >
        <div>
          <fa
            v-if="!activeAccessibility"
            :icon="['fas', 'chevron-down']"
          />
          <fa v-else :icon="['fas', 'chevron-up']" />
        </div>
      </div>
      <div v-if="activeAccessibility">
        <div>
          <span
            class="block text-xs text-textColor-secondary text-left"
            >Alt text describes your photos for people with
            visual impairments. Alt text will be
            automatically created for your photos or you can
            choose to write your own.</span
          >
          <div class="mt-3">
            <div
              v-for="media in medias"
              :key="media.url"
              class="flex mb-4"
            >
              <div class="w-11 h-11 mr-2">
                <img :src="media.url" />
              </div>
              <div
                class="flex-grow border border-separator-modal rounded-md
                  overflow-hidden"
              >
                <input
                  class="w-full h-full px-3 py-1 text-sm"
                  type="text"
                  placeholder="Write alt text..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex-col w-full px-4 text-base border-t
        border-separator-modal"
    >
      <div
        class="flex items-center justify-between w-full cursor-pointer"
      >
        <span class="py-3 leading-[20px]"
          >Advanced settings</span
        >
        <div>
          <fa v-if="true" :icon="['fas', 'chevron-down']" />
          <fa v-else :icon="['fas', 'chevron-up']" />
        </div>
      </div>
    </div> -->
    </div>
  </div>
</template>

<style scoped>
.emoji-picker::after {
  content: '';
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: -8px;
  left: 8px;
  background: #fff;
  border-radius: 2px;
  transform: rotateZ(45deg);
  z-index: -1;
}

.maximum-characters-tolltip-title::after {
  content: '';
  width: 20px;
  height: 20px;
  position: absolute;
  top: -5px;
  right: 10px;
  background: #000;
  border-radius: 2px;
  transform: rotateZ(45deg);
  z-index: -1;
}

.maximum-characters-tolltip-caption::after {
  content: '';
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: -5px;
  right: 10px;
  background: #000;
  border-radius: 2px;
  transform: rotateZ(45deg);
  z-index: -1;
}

/* .cross-mark {
  width: 10px;
  height: 10px;
} */
</style>
