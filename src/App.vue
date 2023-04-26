<script setup lang="ts">
import TheWhiteboard from './components/whiteboard/TheWhiteboard.vue'
import TheNavbar from './components/navbar/TheNavbar.vue'
</script>

<template>
  <TheNavbar></TheNavbar>
  <main>
    <TheWhiteboard></TheWhiteboard>
  </main>
</template>

<style lang="scss">
main {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
</style>
