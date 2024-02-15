<script lang="ts" setup></script>

<template>
  <section class="dashboard w-full min-h-screen bg-bgColor-primary">
    <main
      class="w-full ml-0 min-[1264px]:ml-nav-medium
        min-[1264px]:w-[calc(100%-theme(spacing.nav-medium))]
        min-[768px]:ml-nav-narrow
        min-[768px]:w-[calc(100%-theme(spacing.nav-narrow))] pb-[47px]
        min-[736px]:pb-0"
    >
      <slot />
    </main>
  </section>
</template>
