<script setup lang="ts">
import Card from './card/Card.vue'
import { useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

// 判断是否移动端
const { width } = useWindowSize()
const c_width = computed(() => (width.value < 415 ? 336 : 550))
</script>

<template>
  <div w-full h-full class="login-bg" relative overflow-hidden select-none>
    <Card :height="400" :width="c_width" absolute padding="60">
      <RouterView />
    </Card>
  </div>
</template>

<style scoped lang="scss">
.login-bg {
  background-image: -webkit-gradient(
    to right,
    #eea2a2 0%,
    #bbc1bf 19%,
    #57c6e1 42%,
    #b49fda 79%,
    #7ac5d8 100%
  );
  background-image: linear-gradient(
    to right,
    #eea2a2 0%,
    #bbc1bf 19%,
    #57c6e1 42%,
    #b49fda 79%,
    #7ac5d8 100%
  );
  background-image: -o-linear-gradient(
    to right,
    #eea2a2 0%,
    #bbc1bf 19%,
    #57c6e1 42%,
    #b49fda 79%,
    #7ac5d8 100%
  );
}
</style>
