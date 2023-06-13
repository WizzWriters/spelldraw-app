<script setup lang="ts">
import TheNavbar from './components/navbar/TheNavbar.vue'
</script>

<template>
  <TheNavbar></TheNavbar>
  <main>
    <RouterView></RouterView>
  </main>
</template>

<style lang="scss">
main {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
</style>
