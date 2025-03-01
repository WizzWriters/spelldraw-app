<script setup lang="ts">
import LogoSvg from '@/assets/logo/icon.svg?no-inline'
</script>

<template>
  <div class="logo m-2 is-flex">
    <img :src="LogoSvg" id="logo-icon" />
    <div class="logo-name ml-2">Spelldraw</div>
  </div>
</template>
