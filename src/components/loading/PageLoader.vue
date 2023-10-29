<template>
  <div class="pageloader is-active">
    <span class="title">
      <slot>Loading...</slot>
    </span>
  </div>
</template>

<style scoped lang="scss">
.pageloader {
  bottom: unset;
  top: unset;
  left: unset;
  right: unset;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
