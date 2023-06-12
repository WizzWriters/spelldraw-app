<template>
  <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="1.5" result="NeonGlow" />
    <feMerge>
      <feMergeNode in="NeonGlow" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
</template>
