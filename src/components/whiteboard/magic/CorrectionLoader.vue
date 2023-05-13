<script setup lang="ts">
import { usePointerTracker } from '@/common/composables/PointerTracker'
import { computed, ref, type Ref } from 'vue'

const props = defineProps<{
  isShown: Boolean
  isLoading: Boolean
  isTrackingPointer: Boolean
  status: Boolean
  value: number
  maxValue: number
}>()

const pointerPosition = usePointerTracker()

const loaderRef: Ref<HTMLElement | null> = ref(null)

const loaderPosition = computed(() => {
  if (!props.isTrackingPointer) {
    const boundingRect = loaderRef.value?.getBoundingClientRect()
    if (!boundingRect) return { xCoordinate: 0, yCoordinate: 0 }
    return { xCoordinate: boundingRect.left, yCoordinate: boundingRect.top }
  }

  return {
    xCoordinate:
      pointerPosition.value.xCoordinate - (loaderRef?.value?.clientWidth || 0),
    yCoordinate:
      pointerPosition.value.yCoordinate - (loaderRef?.value?.clientHeight || 0)
  }
})
</script>

<template>
  <Transition>
    <div
      v-if="isShown"
      id="loader"
      class="box p-2 has-text-centered"
      ref="loaderRef"
      :style="
        `top: ${loaderPosition.yCoordinate}px;` +
        `left: ${loaderPosition.xCoordinate}px;`
      "
    >
      <p v-if="!isLoading && status" class="has-text-success p-0">
        <FontAwesomeIcon icon="fa-check" />
      </p>
      <p v-else-if="!isLoading && !status" class="has-text-danger p-0">
        <FontAwesomeIcon icon="fa-times" />
      </p>
      <progress
        v-else
        class="progress is-small is-primary"
        :value="value"
        :max="maxValue"
      ></progress>
    </div>
  </Transition>
</template>

<style lang="scss">
#loader {
  position: fixed;
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
  width: 50px;
  height: 40px;
  display: flex;
  align-items: center;

  p {
    width: 100%;
  }
}

.v-enter-active {
  transition: opacity 0.2s ease;
}

.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
