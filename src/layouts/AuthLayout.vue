<script lang="ts" setup></script>

<template>
  <section class="auth flex flex-col h-screen items-center">
    <div class="w-fit mt-5 border border-red-600 text-red-500 p-5 rounded-md">
      This is a clone of Instagram for demonstration purposes only and it is not
      affiliated with the original platform whatsoever.
      <a
        href="https://github.com/cornuel/instagram"
        target="_blank"
      >
        Repo available here on my github.
      </a>
    </div>
    <main class="flex flex-grow w-full justify-center">
      <slot />
    </main>
  </section>
</template>
