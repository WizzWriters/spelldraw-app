<script setup lang="ts">
import MainWhiteboard from './components/whiteboard/MainWhiteboard.vue'
import MainNavbar from './components/navbar/MainNavbar.vue'
import './services/magic/ShapeWizard'
</script>

<template>
  <MainNavbar></MainNavbar>
  <main>
    <MainWhiteboard></MainWhiteboard>
  </main>
</template>

<style lang="scss">
main {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
</style>
