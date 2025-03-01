<script setup lang="ts">
import LogoSvg from '@/assets/logo/icon.svg?no-inline'
</script>

<template>
  <div class="pageloader has-background-white">
    <div class="prompt is-flex is-flex-direction-column">
      <img :src="LogoSvg" style="max-height: 6rem" />
      <progress
        class="progress is-small is-info mt-5 mb-2"
        max="100"
      ></progress>
      <span class="has-text-centered is-size-6">Preparing the board...</span>
    </div>
  </div>
</template>
