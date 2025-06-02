<script lang="ts" setup></script>

<template>
  <section class="auth flex flex-col h-screen items-center">
    <div class="w-fit mt-5 border border-red-600 text-red-500 p-5 rounded-md">
      <strong>Disclaimer:</strong>
      <p>
        This is a <strong>DEMONSTRATION</strong> site and IS NOT the
        <strong>REAL</strong> Instagram.
      </p>
      <p>👉NEVER ENTER your real Instagram credentials here.</p>
      <p>
        This site is solely intended to showcase my development skills and is not
        affiliated with any official platform
      </p>
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
