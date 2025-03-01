<script setup lang="ts">
import LogoSvg from '@/assets/logo/icon.svg?no-inline'
</script>

<template>
  <div class="container is-flex is-align-items-center">
    <div class="container is-flex is-flex-direction-column m-3">
      <img :src="LogoSvg" style="max-height: 10rem" />
      <h2 class="is-size-1 mt-5 has-text-centered">
        We couldn't find this board :(
      </h2>
      <h2 class="is-size-4 has-text-centered">
        Please refresh this page to create a new board.
      </h2>
    </div>
  </div>
</template>
