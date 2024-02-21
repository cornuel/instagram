<script lang="ts" setup>
import UiButton from '@/components/Atom/UiButton.vue'
import BookmarkIcon from '@icons/bookmark.svg'
</script>

<template>
  <div
    class="flex items-center justify-between w-full mt-8 mb-4"
  >
    <span class="text-xs text-textColor"
      >Only you can see what you've saved</span
    >
  </div>
  <div class="flex flex-center">
    <div
      class="w-full max-w-[350px] mx-11 my-[60px] flex flex-col
        flex-center text-center"
    >
      <div class="flex items-center justify-center">
        <BookmarkIcon
          class="w-8 h-8 text-black absolute"
          style="stroke-width: 1px"
        />
        <div
          class="w-16 h-16 rounded-full border-black"
          style="border-width: 1.5px"
        ></div>
      </div>

      <span class="my-6 text-3xl font-extrabold">Save</span>
      <span class="text-center"
        >Save photos and videos that you want to see again.
        No one is notified, and only you can see what you've
        saved.</span
      >
    </div>
  </div>
</template>
