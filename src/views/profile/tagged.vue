<script lang="ts" setup>
import TagIcon from '@icons/user-square.svg'
</script>

<template>
  <div class="flex flex-center">
    <div
      class="w-full max-w-[350px] mx-11 my-[60px] flex flex-col
        flex-center text-center"
    >
      <div class="flex items-center justify-center">
        <TagIcon
          class="w-8 h-8 text-black absolute"
          style="stroke-width: 1px"
        />
        <div
          class="w-16 h-16 rounded-full border-black"
          style="border-width: 1.5px"
        ></div>
      </div>

      <span class="my-6 text-3xl font-extrabold"
        >Photos of you</span
      >
      <span class="text-center"
        >When people tag you in photos, they'll appear
        here.</span
      >
    </div>
  </div>
</template>
