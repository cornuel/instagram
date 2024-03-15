<script lang="ts" setup>
import Nav from '@/components/Molecules/Nav/Nav.vue'
import { useProfileStore } from '@/stores'
import { storeToRefs } from 'pinia'

const { authenticatedProfile } = storeToRefs(
  useProfileStore()
)
</script>

<template>
  <section
    class="dashboard overflow-x-hidden w-full h-screen
      bg-bgColor-primary"
  >
    <Nav v-if="authenticatedProfile" />
    <main
      class="w-full ml-0 min-[1264px]:ml-nav-medium
        min-[1264px]:w-[calc(100%-theme(spacing.nav-medium))]
        min-[768px]:ml-nav-narrow
        min-[768px]:w-[calc(100%-theme(spacing.nav-narrow))]
        pb-[47px] min-[736px]:pb-0"
    >
      <slot />
    </main>
  </section>
</template>
