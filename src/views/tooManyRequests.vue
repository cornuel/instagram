<script setup lang="ts"></script>

<template>
  <div class="p-10 text-center text-textColor-primary">
    <h3 class="text-2xl font-semibold mb-6">Too many requests.</h3>
    <p class="text-base">
      You have exceeded your request limit. Please try again later.
      <router-link
        class="text-link"
        to="/"
        >Go back to Instagram.</router-link
      >
    </p>
  </div>
</template>
