<script setup lang="ts">
import { useBoardStore } from '@/store/BoardStore'
import pencilPointerUrl from '@/assets/pointers/pencil-solid.svg'

const boardStore = useBoardStore()
</script>

<template>
  <g>
    <image
      v-for="(user, idx) of boardStore.connectedUsers"
      :key="idx"
      :x="user.position.xCoordinate"
      :y="user.position.yCoordinate"
      :href="pencilPointerUrl"
    />
  </g>
</template>
